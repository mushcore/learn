---
title: Link-layer (MAC) addresses and why they change at every hop
minutes: 16
---

A datagram carries the IP addresses of its two ends, but an IP address says nothing about which wire to put the frame on next. The frame header carries a second pair of addresses for that, and that pair is rewritten on every link.

## Why we need link-layer addressing

Slide wording (slide 13): *The source and destination IP addresses in the header of a datagram define the two ends but cannot define which links the datagram should pass through.* So *the datagram (coming from the network layer) will be encapsulated in a frame and two data-link addresses are added to the frame header. These two addresses are changed every time the frame moves from one link to another.*

Two pairs of addresses, two jobs: the IP pair names the journey's two ends and never changes; the link-layer pair names the two ends of the current hop and changes at every node.

## Link-layer address = physical address = MAC address

*Link-layer address = Physical address = MAC (Media Access Control) address.* Three names for one thing.

*In the most common LAN, Ethernet, MAC addresses are 48 bits (6 bytes) and are presented as 12 hexadecimal digits separated by colons.*

Count it on the slide's example, `00:1A:3F:F1:4C:C6`: six groups of two hex digits is 12 digits; each hex digit is 4 bits, so $12 \times 4 = 48$ bits, or 6 bytes. An IP address is 32 bits; a MAC address is 48. Keep the two numbers apart.

## The first three bytes are the OUI

The slide's stock image splits the address in half:

| Bytes | `00:1A:3F` | `F1:4C:C6` |
|---|---|---|
| Name | **Organizationally Unique Identifier (OUI)** | device part (the image labels it "Universally Administered Address") |
| Who assigns it | the registry, per manufacturer | the manufacturer, per interface |

The lookup screenshot on the next slide types in `F0:1F:C7` and gets **Apple, Inc.**, 1 Infinite Loop, Cupertino. Its block type is **MA-L**, *MAC Address Block Large (previously named OUI)*, with *number of address 2^24 (~16 million)*: three bytes are fixed by the OUI, so the remaining three bytes, 24 bits, give $2^{24}$ = 16 777 216 addresses in the block.

## A layer-2 switch forwards to one device

Slide wording: *A link-layer switch is involved only in two layers, data-link and physical. A switch connects devices within a network. Unlike a router, a switch only sends data to the single device it is intended for (which may be another switch, a router, or a user's computer), not to networks of multiple devices. Most switches are layer 2 switches (we also have layer 3 switches, but they are less common).*

The switch reads the destination MAC address in the frame and sends the frame out of the one port that leads to that device. It never changes the addresses; only a router does that.

## The small internet: three links, three frames

The slide's "IP addresses and link-layer addresses in a small internet" has Alice, two routers and Bob. Every interface has an IP address N and a link-layer address L:

| Node | Interfaces |
|---|---|
| Alice | $N_1\ L_1$ on Link 1 |
| R1 | $N_2\ L_2$ on Link 1; $N_3\ L_3$ to another link; $N_4\ L_4$ on Link 2 |
| R2 | $N_5\ L_5$ on Link 2; $N_6\ L_6$ to another network; $N_7\ L_7$ on Link 3 |
| Bob | $N_8\ L_8$ on Link 3 |

Links 1 and 2 are LANs with a switch; Link 3 is Bob's LAN. A router has one N and one L **per link it touches**, which is why R1 and R2 each have three pairs.

The frame on each link, read left to right as the slide draws it:

| Link | Frame | Link-layer destination | Link-layer source | IP source | IP destination |
|---|---|---|---|---|---|
| Link 1 (Alice to R1) | $[L_2 \mid L_1 \mid N_1 \mid N_8 \mid \text{Data}]$ | $L_2$ (R1) | $L_1$ (Alice) | $N_1$ | $N_8$ |
| Link 2 (R1 to R2) | $[L_5 \mid L_4 \mid N_1 \mid N_8 \mid \text{Data}]$ | $L_5$ (R2) | $L_4$ (R1) | $N_1$ | $N_8$ |
| Link 3 (R2 to Bob) | $[L_8 \mid L_7 \mid N_1 \mid N_8 \mid \text{Data}]$ | $L_8$ (Bob) | $L_7$ (R2) | $N_1$ | $N_8$ |

Boxed on the slide, the **order of addresses**: *IP addresses: source-destination. Link-layer address: destination-source.* The IP pair reads $N_1 N_8$, source then destination. The link-layer pair reads destination then source, so the first field of every frame is the MAC address of the node that should pick it up.

Three things to notice in the table. The IP pair $N_1 N_8$ is identical on all three links. The link-layer pair is different on every link. And $L_3$ and $L_6$ never appear: those interfaces face other links the datagram does not use.

### The frame on each link of the small internet

```widget
hop-walk
{ "preset": "small internet (slides 18-21)", "draw": false }
```

Click each link and check the frame against the table. Then fill the two L fields yourself on every link:

```widget
hop-walk
{ "preset": "small internet (slides 18-21)", "draw": true }
```

:::quiz Reading a frame in the slide's order
When a question shows a frame $[L_x \mid L_y \mid N_1 \mid N_8 \mid \text{Data}]$, $L_x$ is the receiver on this link and $L_y$ is the sender on this link. To write the frame for a link, ask: which interface sends it, which interface receives it, then write receiver first.
:::

```quiz
[
  {
    "q": "According to the slide, why do we need link-layer addressing when a datagram already carries source and destination IP addresses?",
    "options": [
      "IP addresses are too long to fit in a frame header",
      "IP addresses define the two ends but cannot define which links the datagram should pass through",
      "IP addresses change at every hop, so a fixed address is needed",
      "Switches cannot read binary numbers"
    ],
    "answer": 1,
    "explain": "Slide 13: the source and destination IP addresses define the two ends but cannot define which links the datagram should pass through. Two link-layer addresses are added to the frame header and changed every time the frame moves from one link to another."
  },
  {
    "q": "Link-layer address, physical address and MAC address are three names for the same address.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 14: link-layer address = physical address = MAC (Media Access Control) address."
  },
  {
    "q": "How many bits long is an Ethernet MAC address?",
    "type": "numeric",
    "answer": 48,
    "tolerance": 0,
    "unit": "bits",
    "explain": "48 bits = 6 bytes, written as 12 hexadecimal digits separated by colons (12 digits × 4 bits each). An IP address is 32 bits; do not swap them."
  },
  {
    "q": "An Ethernet MAC address is presented as how many hexadecimal digits?",
    "options": ["8", "6", "16", "12"],
    "answer": 3,
    "explain": "12 hexadecimal digits separated by colons, in six pairs such as 00:1A:3F:F1:4C:C6. Six pairs is 6 bytes; 12 digits × 4 bits is 48 bits."
  },
  {
    "q": "In the MAC address F0:1F:C7:12:34:56, which part is the Organizationally Unique Identifier (OUI)?",
    "options": ["12:34:56", "F0:1F:C7", "F0", "C7:12:34"],
    "answer": 1,
    "explain": "The OUI is the first three bytes. The slide's lookup of F0:1F:C7 returns Apple, Inc. The remaining three bytes are assigned by the manufacturer, giving 2^24 (about 16 million) addresses per block."
  },
  {
    "q": "A link-layer (layer 2) switch is involved in which layers?",
    "options": [
      "Physical only",
      "Network, data-link and physical",
      "Data-link and physical",
      "All five layers"
    ],
    "answer": 2,
    "explain": "A link-layer switch is involved only in two layers, data-link and physical. A router reaches the network layer. Layer 3 switches exist but are less common."
  },
  {
    "q": "Unlike a router, a switch sends data to the single device it is intended for, not to networks of multiple devices.",
    "type": "tf",
    "answer": true,
    "explain": "That is the slide's wording. The switch reads the destination MAC address and forwards the frame out of the one port that leads to that device, which may be another switch, a router or a user's computer."
  },
  {
    "q": "In a frame, the slide's order of addresses is: IP addresses source-destination, link-layer addresses _______-source.",
    "type": "text",
    "answer": ["destination"],
    "explain": "IP addresses: source-destination. Link-layer address: destination-source. The first field of the frame is the MAC address of the node that should pick it up on this link."
  },
  {
    "q": "In the small internet, Alice is N₁ L₁, R1 has N₂ L₂ on Link 1 and N₄ L₄ on Link 2, R2 has N₅ L₅ on Link 2 and N₇ L₇ on Link 3, Bob is N₈ L₈. Which frame travels on Link 2?",
    "options": [
      "[L₄ | L₅ | N₁ | N₈ | Data]",
      "[L₅ | L₄ | N₄ | N₅ | Data]",
      "[L₂ | L₁ | N₁ | N₈ | Data]",
      "[L₅ | L₄ | N₁ | N₈ | Data]"
    ],
    "answer": 3,
    "explain": "On Link 2 the sender is R1's interface L₄ and the receiver is R2's interface L₅. Link-layer order is destination-source, so L₅ then L₄. The IP pair stays N₁ N₈ (source-destination) on every link; the routers' own IP addresses never go into the datagram."
  },
  {
    "q": "In the same small internet, which link-layer addresses never appear in any of the three frames? Select all that apply.",
    "options": ["L₃", "L₄", "L₆", "L₇"],
    "answer": [0, 2],
    "explain": "L₃ (R1's interface to another link) and L₆ (R2's interface to another network) face links the datagram does not use. L₄ is the source on Link 2 and L₇ is the source on Link 3."
  },
  {
    "q": "As the frame moves from Link 1 to Link 3 in the small internet, the IP addresses in it change from N₁ N₈ to N₂ N₈ and then N₅ N₈.",
    "type": "tf",
    "answer": false,
    "explain": "The IP pair N₁ N₈ is the same on all three links: IP addresses define the two ends of the whole journey. Only the two link-layer addresses change every time the frame moves from one link to another."
  }
]
```
