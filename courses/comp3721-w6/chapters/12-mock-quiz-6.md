---
title: Mock Quiz 6 (Week 6)
minutes: 35
---

The lab quizzes follow the lectures one week behind, so Quiz 6 is expected to cover Lectures 06a and 06b: bandwidth utilization and multiplexing, FDM with guard bands, WDM, synchronous TDM rates, data-rate management and framing bits, then the data-link layer's services and sublayers, link-layer addresses, ARP and Alice's datagram to Bob. Same rules as the real thing: one A4 or letter page of notes, single-sided and preferably hand-written, a calculator, and a unit with every calculated answer. Frames are written as the slides draw them, `[ destination link-layer | source link-layer | source IP | destination IP | Data ]`; in the fill-in frames type the addresses without subscripts, as `L1`, `L2`, `LA`, `LB`.

```quiz
[
  {
    "q": "What is the goal of multiplexing?",
    "options": ["Privacy", "Spreading one signal over a wider bandwidth", "Efficiency", "Error control"],
    "answer": 2,
    "explain": "Bandwidth utilization is the wise use of available bandwidth, and there are two techniques. Multiplexing combines several channels into one; its goal is efficiency. Spectrum spreading has privacy as its goal and is not discussed in this class."
  },
  {
    "type": "match",
    "q": "Match each term of the multiplexing figure to its meaning.",
    "pairs": [
      ["Link", "the physical path"],
      ["Channel", "the portion of a link"],
      ["MUX", "combines the n input lines into one link"],
      ["DEMUX", "separates the one link back into n output lines"]
    ],
    "explain": "The slide figure reads n input lines → MUX → 1 link, n channels → DEMUX → n output lines. Multiplexing is the set of techniques that allow the simultaneous transmission of multiple signals across a single data link."
  },
  {
    "q": "Select the multiplexing techniques the slide marks as working on analog signals.",
    "options": ["FDM", "TDM", "WDM", "Statistical TDM"],
    "answer": [0, 2],
    "explain": "FDM and WDM are analog techniques; WDM combines optical signals on fibre, where a prism does the combining and splitting of the light. TDM is the digital technique: instead of sharing a portion of the bandwidth, time is shared. Statistical TDM is a TDM variant, so it is digital too."
  },
  {
    "q": "Fill in the blank: strips of unused bandwidth that separate channels from each other, to prevent signals from overlapping and interference, are called ________.",
    "type": "text",
    "answer": ["guard bands", "guard band"],
    "explain": "Guard bands sit between adjacent FDM channels. n channels need n − 1 of them, which is why Example 1's five channels need four guard bands."
  },
  {
    "q": "Five channels, each with a 100-kHz bandwidth, are to be multiplexed together. What is the minimum bandwidth of the link if there is a need for a guard band of 10 kHz between the channels to prevent interference? Answer in kHz.",
    "type": "numeric",
    "answer": 540,
    "tolerance": 0.5,
    "unit": "kHz",
    "explain": "5 channels → at least 4 guard bands. Minimum bandwidth = (5 × 100k) + (4 × 10k) = 540 kHz. In general $B_{link} = n \\times B + (n - 1) \\times G$."
  },
  {
    "q": "Ten channels, each with a 20-kHz bandwidth, are combined with FDM, and a guard band of 2 kHz is needed between adjacent channels. What is the minimum bandwidth of the link, in kHz?",
    "type": "numeric",
    "answer": 218,
    "tolerance": 0.5,
    "unit": "kHz",
    "explain": "10 channels → 9 guard bands. $10 \\times 20 + 9 \\times 2 = 200 + 18 = 218$ kHz. Counting 10 guard bands (220 kHz) is the usual slip: the gaps sit between channels, not after the last one."
  },
  {
    "q": "A voice channel occupies a bandwidth of 4 kHz. Three voice channels are combined into a link with a bandwidth of 12 kHz, from 20 to 32 kHz, with no guard bands. Which band does the second channel occupy on the link?",
    "options": ["20-24 kHz", "24-28 kHz", "28-32 kHz", "22-26 kHz"],
    "answer": 1,
    "explain": "Each telephone's 0-4 kHz signal is shifted by a modulator and the three are combined: 20-24, 24-28 and 28-32 kHz. The receiver uses a bandpass filter for each band and shifts it back to 0-4 kHz."
  },
  {
    "q": "A synchronous TDM multiplexer has n input lines, each with an input unit of duration T. Which statement is correct?",
    "options": ["The frame rate is n times the input rate", "The duration of each frame is T/n", "A unit on the output link lasts n times longer than T", "The data rate of the output link must be n times the data rate of a connection"],
    "answer": 3,
    "explain": "The duration of each slot is T/n and the duration of each frame is T, the same as an input unit, so the frame rate is always the same as any input rate. The link is n times faster and the unit duration on it is n times shorter."
  },
  {
    "q": "A multiplexer combines four 100-kbps channels using a time slot of 2 bits. What is the frame rate? Answer in frames per second.",
    "type": "numeric",
    "answer": 50000,
    "tolerance": 1,
    "unit": "frames/s",
    "explain": "Frame rate = input unit rate = 100 kbps ÷ 2 bits = 50 000 frames per second. A frame leaves each time every input has produced one 2-bit unit; 100 kbps counts bits, not units."
  },
  {
    "q": "Same multiplexer (four 100-kbps channels, 2-bit slots). What is the frame duration, in μs?",
    "type": "numeric",
    "answer": 20,
    "tolerance": 0.01,
    "unit": "μs",
    "explain": "Frame duration = 1 ÷ 50 000 s = 20 μs. It equals the duration of one input unit: 2 bits at 100 kbps take 2 × 10 μs."
  },
  {
    "q": "Same multiplexer. What is the bit rate of the shared channel, in kbps?",
    "type": "numeric",
    "answer": 400,
    "tolerance": 0.5,
    "unit": "kbps",
    "explain": "Bit rate = 4 × 100 kbps = 400 kbps. The output link must carry n times the data rate of a connection to guarantee the flow of data."
  },
  {
    "q": "Same multiplexer. What is the bit duration on the shared channel, in μs?",
    "type": "numeric",
    "answer": 2.5,
    "tolerance": 0.01,
    "unit": "μs",
    "explain": "Bit duration = 1 ÷ 400 kbps = 2.5 μs. The frame duration (20 μs) is 8 times the bit duration because each frame carries 4 slots × 2 bits = 8 bits."
  },
  {
    "q": "A synchronous TDM multiplexer combines five 8-kbps input lines using a time slot of one character (8 bits). What is the frame rate, in frames per second?",
    "type": "numeric",
    "answer": 1000,
    "tolerance": 1,
    "unit": "frames/s",
    "explain": "Frame rate = input unit rate = 8000 bps ÷ 8 bits per unit = 1000 frames per second. The frame rate is always the same as any input rate counted in units."
  },
  {
    "q": "Same multiplexer (five 8-kbps lines, 8-bit slots). What is the bit rate of the link, in kbps?",
    "type": "numeric",
    "answer": 40,
    "tolerance": 0.1,
    "unit": "kbps",
    "explain": "Link bit rate = n × input rate = 5 × 8 kbps = 40 kbps. Check: 1000 frames/s × 40 bits per frame = 40 000 bps."
  },
  {
    "q": "Same multiplexer. What is the duration of one time slot on the link, in μs?",
    "type": "numeric",
    "answer": 200,
    "tolerance": 0.5,
    "unit": "μs",
    "explain": "Frame duration = 1 ÷ 1000 = 1 ms = T, the duration of one 8-bit input unit. Slot duration = T/n = 1 ms ÷ 5 = 200 μs. Check: bit duration on the link is 1 ÷ 40 kbps = 25 μs and a slot holds 8 bits, 8 × 25 = 200 μs."
  },
  {
    "q": "Five sources each create 400 characters per second (8-bit characters); one character per slot and 1 framing bit per frame. What is the data rate of the link, in bps?",
    "type": "numeric",
    "answer": 16400,
    "tolerance": 0,
    "unit": "bps",
    "explain": "Frame rate = character rate = 400 frames/s. Bits per frame = 5 × 8 + 1 = 41. Link rate = frame rate × bits per frame = 400 × 41 = 16 400 bps. Without the framing bit it would be 5 × 3200 = 16 000 bps; the framing bits add 400 bps, as in E06 exercise 2 (250 × 33 = 8250 bps)."
  },
  {
    "q": "A 150 kbps channel and a 300 kbps channel are multiplexed with synchronous TDM using 1-bit slots and multiple-slot allocation. What is the frame rate, in frames/s?",
    "type": "numeric",
    "answer": 150000,
    "tolerance": 0,
    "unit": "frames/s",
    "explain": "300 = 2 × 150, so the 300 kbps channel takes two 150 kbps slots and each frame has 1 + 2 = 3 slots. With 1-bit slots the frame rate is the per-slot rate, 150 000 frames/s; the frame lasts 1 ÷ 150 000 = 6.67 μs and the link runs at 3 × 150 = 450 kbps."
  },
  {
    "q": "For that 150 kbps and 300 kbps pair, which data-rate management technique is used, and how many slots in each frame does each channel get?",
    "options": ["Multiple-slot allocation: 1 slot for the 150 kbps channel, 2 slots for the 300 kbps channel", "Multilevel multiplexing: the two channels are first multiplexed into one 450 kbps line", "Pulse stuffing: the 150 kbps channel is padded to 300 kbps, 1 slot each", "Multiple-slot allocation: 2 slots for the 150 kbps channel, 1 slot for the 300 kbps channel"],
    "answer": 0,
    "explain": "300 is an integer multiple of 150 and there is no second 150 kbps line to pre-multiplex, so the 300 kbps channel is demultiplexed into two 150 kbps lines: **multiple-slot allocation**, 1 slot for the 150 kbps channel and 2 for the 300 kbps channel. Pulse stuffing is for rates that are not integer multiples, and padding 150 up to 300 would waste 150 kbps."
  },
  {
    "type": "match",
    "q": "Match each data-rate management strategy to when the slide uses it.",
    "pairs": [
      ["Multilevel multiplexing", "the data rate of an input line is a multiple of others: two 20 kbps lines are first multiplexed into one 40 kbps line"],
      ["Multiple-slot allocation", "more than one slot in a frame goes to a single input line: the 50 kbps line is demultiplexed into two 25 kbps slots"],
      ["Pulse stuffing", "the bit rates are not integer multiples of each other: dummy bits raise 46 kbps to the dominant 50 kbps"]
    ],
    "explain": "The slide figures end at 160 kbps (40 + 3 × 40), 125 kbps (5 × 25, two slots for the 50 kbps input) and 150 kbps (3 × 50). Pulse stuffing is also called bit padding or bit stuffing; the three strategies can be combined."
  },
  {
    "q": "Three sources at 50 kbps, 50 kbps and 46 kbps are to be multiplexed with synchronous TDM. Which data-rate management strategy does the slide use?",
    "options": ["Pulse stuffing", "Multilevel multiplexing", "Multiple-slot allocation", "Statistical TDM"],
    "answer": 0,
    "explain": "46 is not an integer multiple of 50, so neither multilevel multiplexing nor multiple-slot allocation fits. Pulse stuffing makes the highest input data rate the dominant data rate and adds dummy bits to the 46 kbps line until it runs at 50 kbps; the output is 3 × 50 = 150 kbps. Statistical TDM removes empty slots; it is not a rate-disparity fix."
  },
  {
    "q": "Framing bits are one or more synchronization bits that are usually added to the end of each frame.",
    "type": "tf",
    "answer": false,
    "explain": "They are usually added to the **beginning** of each frame and follow a pattern (e.g., 1 0 1 …) frame to frame, so the demultiplexer can synchronize with the incoming stream and separate the time slots accurately. Synchronization between the multiplexer and demultiplexer is the major issue they solve."
  },
  {
    "q": "Fill in the blank: a packet at the data-link layer is called a ________.",
    "type": "text",
    "answer": ["frame"],
    "explain": "Framing encapsulates the datagram in a frame before sending it to the next node. Each link may use a different frame format, so the frame is rebuilt at every node while the datagram inside stays the same."
  },
  {
    "q": "Why are encapsulation and decapsulation needed at each intermediate node? Select the slide's two reasons.",
    "options": ["Each link may be using a different protocol with a different frame format", "The IP addresses in the datagram must be rewritten at each router", "Even on the same protocol, the link-layer addresses are normally different from one link to the next", "The transport layer must check the datagram at each router"],
    "answer": [0, 2],
    "explain": "A router decapsulates the frame of type 1, passes the datagram to its other data-link layer, and that layer encapsulates it in a frame of type 2 with new link-layer addresses. The IP addresses are not rewritten and a router has no transport layer."
  },
  {
    "q": "Select the services provided by the data-link layer on the slide's list.",
    "options": ["Framing", "Routing", "Flow control", "Error control", "Congestion control", "Encryption"],
    "answer": [0, 2, 3, 4],
    "explain": "Framing: encapsulating the datagram in a frame before sending it to the next node. Flow control: controlling the rate of producing frames w.r.t. the rate of consumed frames. Error control: error detection and correction. Congestion control is the fourth. The layer sits between the physical layer and the network layer, serving the network layer and served by the physical layer."
  },
  {
    "q": "Which sublayer of the data-link layer deals only with issues specific to broadcast (shared) links?",
    "options": ["Data Link Control (DLC)", "Media Access Control (MAC)", "Logical Link Control (LLC)", "Physical"],
    "answer": 1,
    "explain": "DLC deals with issues common to both point-to-point (dedicated) and broadcast (shared) links: framing, flow control and error control. MAC deals only with the shared-link issues, controlling access to the link."
  },
  {
    "q": "The source and destination IP addresses in the header of a datagram define which links the datagram should pass through.",
    "type": "tf",
    "answer": false,
    "explain": "They define the two ends but cannot define which links the datagram should pass through. That is why two data-link addresses are added to the frame header, and these two addresses are changed every time the frame moves from one link to another."
  },
  {
    "q": "In Ethernet, how long is a MAC address and how is it written?",
    "options": ["32 bits, written as four decimal numbers separated by dots", "64 bits (8 bytes), written as 16 hexadecimal digits", "48 bits (6 bytes), written as 12 hexadecimal digits separated by colons", "128 bits, written as eight groups of hexadecimal digits"],
    "answer": 2,
    "explain": "Link-layer address = physical address = MAC address: 48 bits, 6 bytes, 12 hexadecimal digits separated by colons, e.g. 00:1A:3F:F1:4C:C6. The first three bytes are the Organizationally Unique Identifier (F0:1F:C7 → Apple), a block of 2^24 addresses. 32 bits with dots is an IPv4 address."
  },
  {
    "q": "A link-layer switch is involved in which layers?",
    "options": ["Data-link and physical only", "Network, data-link and physical", "Physical only", "All five layers"],
    "answer": 0,
    "explain": "A switch is a layer 2 device: it connects devices within a network and sends data only to the single device it is intended for. A router has network, data-link and physical layers; layer 3 switches exist but are less common."
  },
  {
    "q": "In which order do the slides give the addresses in a frame?",
    "options": ["IP addresses destination-source; link-layer addresses destination-source", "IP addresses source-destination; link-layer addresses source-destination", "IP addresses destination-source; link-layer addresses source-destination", "IP addresses source-destination; link-layer addresses destination-source"],
    "answer": 3,
    "explain": "Order of addresses: IP addresses source-destination, link-layer address destination-source. The frame on Link 1 of the small internet is [L2 | L1 | N1 | N8 | Data]: R1's L2 first, then Alice's L1, then Alice's N1 and Bob's N8."
  },
  {
    "type": "text",
    "q": "In the small internet of the slides, Alice (N1, L1) sends to Bob (N8, L8) through R1 (L2 on Link 1, L4 on Link 2) and R2 (L5 on Link 2, L7 on Link 3). Fill in the two link-layer addresses of the frame on Link 2. The frame is [ ___ | ___ | N1 | N8 | Data ]: type the two link-layer addresses in frame order, separated by a space (for example L9 L8).",
    "answer": ["L5 L4", "L5, L4", "L5,L4", "L5 | L4", "L5|L4", "l5 l4", "l5, l4", "l5,l4", "l5 | l4", "l5|l4", "L_5 L_4", "L_5, L_4", "L_5,L_4", "L_5 | L_4", "L_5|L_4", "l_5 l_4", "l_5, l_4", "l_5,l_4", "l_5 | l_4", "l_5|l_4", "L₅ L₄", "L₅, L₄", "L₅,L₄", "L₅ | L₄", "L₅|L₄"],
    "explain": "Destination first: L5 is R2's interface on Link 2, the source L4 is R1's interface on Link 2. The three frames are [L2 | L1 | N1 | N8], [L5 | L4 | N1 | N8] and [L8 | L7 | N1 | N8]; the IP pair N1 N8 never changes."
  },
  {
    "q": "An ARP reply is broadcast to every system on the link, like the request.",
    "type": "tf",
    "answer": false,
    "explain": "The ARP request is broadcast (\"Looking for link-layer address of a node with IP address N2\"), because the sender does not know who owns N2. The ARP reply is unicast (\"I am the node and my link-layer address is L2\"), sent only to the asker. The request travels in a frame with destination BA (the broadcast address) and source A; the reply in a frame with destination A and source B."
  },
  {
    "q": "In which layer is ARP defined, according to the slide?",
    "options": ["Network layer", "Data-link layer", "Physical layer", "Transport layer"],
    "answer": 0,
    "explain": "ARP is one of the auxiliary protocols defined in the network layer, useful when moving a frame through a link: it maps an IP address to a link-layer address. A host or router runs the ARP program all of the time in the background, because it does not know when another host will send a request."
  },
  {
    "type": "match",
    "q": "Match each value in the slide's ARP packets to its meaning.",
    "pairs": [
      ["0x0001 in the hardware type field", "Ethernet"],
      ["0x0800 in the protocol type field", "IPv4"],
      ["0x06", "hardware length: a 6-byte (48-bit) MAC address"],
      ["0x04", "protocol length: a 4-byte (32-bit) IP address"],
      ["0x0002 in the operation field", "ARP reply"]
    ],
    "explain": "Operation: request 1, reply 2. The same bits 0x0001 mean Ethernet in the hardware type field but request in the operation field, so read the field name before the value. Hardware means the LAN or WAN protocol; protocol means the network-layer protocol."
  },
  {
    "q": "Which field of an ARP request is empty (all 0s)?",
    "options": ["Source hardware address", "Destination protocol address", "Source protocol address", "Destination hardware address"],
    "answer": 3,
    "explain": "The destination hardware address is the unknown being asked for. The slide's request carries L1, N1, All 0s, N2; the reply from B carries L2, N2, L1, N1, with L2 now filled in as the source hardware address."
  },
  {
    "type": "text",
    "q": "Alice (NA, LA) sends a datagram to Bob (NB, LB) through R1 and R2. R1's interface toward Alice is (N1, L1) and toward R2 is L2; R2's interface toward R1 is (N3, L3) and toward Bob is L4. Fill in the frame Alice's data-link layer sends. The frame is [ ___ | ___ | NA | NB | Data ]: type the two link-layer addresses in frame order, separated by a space (for example L9 L8).",
    "answer": ["L1 LA", "L1, LA", "L1,LA", "L1 | LA", "L1|LA", "l1 la", "l1, la", "l1,la", "l1 | la", "l1|la", "L_1 L_A", "L_1, L_A", "L_1,L_A", "L_1 | L_A", "L_1|L_A", "l_1 l_a", "l_1, l_a", "l_1,l_a", "l_1 | l_a", "l_1|l_a", "L₁ LA", "L₁, LA", "L₁,LA", "L₁ | LA", "L₁|LA"],
    "explain": "Alice's network layer consults the forwarding table: NB → next hop N1. ARP (Alice) asks for N1 and ARP (R1) replies L1. The frame is [L1 | LA | NA | NB | Data]: next hop's link-layer address first, Alice's own second."
  },
  {
    "type": "text",
    "q": "Same journey. Fill in the frame R1 sends toward R2. The frame is [ ___ | ___ | NA | NB | Data ]: type the two link-layer addresses in frame order, separated by a space (for example L9 L8).",
    "answer": ["L3 L2", "L3, L2", "L3,L2", "L3 | L2", "L3|L2", "l3 l2", "l3, l2", "l3,l2", "l3 | l2", "l3|l2", "L_3 L_2", "L_3, L_2", "L_3,L_2", "L_3 | L_2", "L_3|L_2", "l_3 l_2", "l_3, l_2", "l_3,l_2", "l_3 | l_2", "l_3|l_2", "L₃ L₂", "L₃, L₂", "L₃,L₂", "L₃ | L₂", "L₃|L₂"],
    "explain": "R1 decapsulates Alice's frame, its forwarding table gives NB → N3, ARP (R1) asks for N3 and ARP (R2) replies L3. The source is L2, R1's own interface on the link to R2, not L1 and not LA: [L3 | L2 | NA | NB | Data]."
  },
  {
    "type": "text",
    "q": "Same journey. Fill in the frame R2 sends to Bob. The frame is [ ___ | ___ | NA | NB | Data ]: type the two link-layer addresses in frame order, separated by a space (for example L9 L8).",
    "answer": ["LB L4", "LB, L4", "LB,L4", "LB | L4", "LB|L4", "lb l4", "lb, l4", "lb,l4", "lb | l4", "lb|l4", "L_B L_4", "L_B, L_4", "L_B,L_4", "L_B | L_4", "L_B|L_4", "l_b l_4", "l_b, l_4", "l_b,l_4", "l_b | l_4", "l_b|l_4", "LB L₄", "LB, L₄", "LB,L₄", "LB | L₄", "LB|L₄"],
    "explain": "At R2 the forwarding table returns NB itself, because Bob is directly connected. ARP (R2) asks for NB and ARP (Bob) replies LB. The frame is [LB | L4 | NA | NB | Data]; Bob's data-link layer decapsulates it and passes the datagram [NA | NB | Data] up."
  },
  {
    "q": "During the journey of Alice's datagram, the network-layer addresses NA and NB are changed at each router, like the link-layer addresses.",
    "type": "tf",
    "answer": false,
    "explain": "The source and destination network-layer addresses, NA and NB, have not been changed during the whole journey. Only the two link-layer addresses change at each link, because each one is a next-hop address for that link alone."
  }
]
```
