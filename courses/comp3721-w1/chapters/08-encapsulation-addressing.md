---
title: Encapsulation & the four addresses
minutes: 14
---

Each device on the path from host A to host B does something different to a message. Headers stack up on the way down and peel off on the way up (**encapsulation**), and each layer that has a header has its own kind of address (**four levels of addresses**).

## Communication through an internet

The slide draws source **A** and destination **B** with a **switch**, a **router** and another **switch** between them. What matters is how many layers each device runs. The widget below draws one switch, between A and the router; the second switch, on the router's far side, would repeat what the first one does.

| Device | Layers it runs | Why |
|---|---|---|
| Source A, Destination B (hosts) | all **5**: application, transport, network, data link, physical | end systems run applications |
| **Switch** | **2**: data link, physical | it only moves frames across one link |
| **Router** | **3**: network, data link, physical | it must read the network-layer address to route between links |

This is the "simpler and less expensive intermediate systems" advantage of layering: a switch never needs transport or application software.

## Encapsulation at the source

Data flows **down** the stack. Each layer adds its own **header** in front of what the layer above gave it: $H_T$ (transport), $H_N$ (network), $H_L$ (link).

| Layer | Adds | Result | PDU name |
|---|---|---|---|
| Application | nothing (it creates the data) | $M$ | **message** |
| Transport | $H_T$ | $H_T\ M$ | **segment** |
| Network | $H_N$ | $H_N\ H_T\ M$ | **datagram** |
| Data link | $H_L$ | $H_L\ H_N\ H_T\ M$ | **frame** |
| Physical | converts to signals | 1010110101... | **bits** |

The second encapsulation slide names the same steps generically: **Data** at L5, **L4 header + data = Segment**, **L3 header = Packet**, **L2 header = Frame**, **bits** at L1. Datagram and packet are the same thing.

**Decapsulation** at the destination is the reverse: the data-link layer removes $H_L$, the network layer removes $H_N$, the transport layer removes $H_T$, and the application receives $M$. That is the first principle of layering, two opposite tasks.

### One message through a switch and a router

The PDU climbs only as high as each device's top layer. Compare the headers on the link into the router with the headers on the link out of it.

```widget
encapsulation
{ "title": "Encapsulation and decapsulation from A to B", "predict": true }
```

## What the switch does

The frame $H_L\ H_N\ H_T\ M$ arrives at the switch's physical layer, goes up **one** layer to data link, and comes back down. The switch reads the link-layer header to pick an outgoing port; the frame leaves **unchanged**.

## What the router does

The router goes up to the **network** layer: data link strips $H_L$, the network layer reads $H_N$ (the destination IP address) to choose the next link, and data link adds a **new** $H_L$ for that link. $H_N$, $H_T$ and $M$ cross the router untouched; $H_L$ is replaced on every link, because a link-layer header describes one hop only.

## An example frame

The slide's example PDU is an Ethernet frame:

| Field | Size |
|---|---|
| Preamble | 8 bytes |
| SFD (start frame delimiter) | 1 byte |
| Destination MAC | 6 bytes |
| Source MAC | 6 bytes |
| EtherType / Length | 2 bytes (0x0800 = IPv4, 0x0806 = ARP, 0x86DD = IPv6) |
| Payload | 46–1500 bytes |
| CRC / FCS | 4 bytes |

Frame size is 64–1522 bytes. The destination and source **MAC addresses** in the header are the link-layer addresses of the next section, and they are what the router rewrites.

## Four levels of addresses

**Four levels of addresses are used in an internet following the TCP/IP protocols**, one per layer that has a header:

| Packet name | Layer | Address | What it identifies |
|---|---|---|---|
| Message | Application | **Names** | website URLs, email addresses, ... |
| Segment / User datagram | Transport | **Port numbers** | identifying a **process on a host** |
| Datagram | Network | **Logical addresses** (IP) | an IP address uniquely defines a **host on the Internet** |
| Frame | Data link | **Link-layer addresses** (MAC) | defining a specific host or router **in a network (LAN or WAN)** |
| Bits | Physical | (none) | |

A logical (IP) address is global: it identifies a host on the whole Internet. A link-layer (MAC) address is local to one network, which is why the router can discard the old $H_L$ and write a new one for the next network.

## E01 exercise 2: changing the LAN technology

*In an internet, we change the LAN technology to a new one. Which layers in the TCP/IP protocol suite need to be changed?*

The answer, with the reason the upper layers are untouched, is worked in [E01 and the sample quiz](#/comp3721-w1/e01-sample-quiz).

## Trace a message across two routers

Host A sends a message to host B through router R1 and then router R2, so the path has three links: A to R1, R1 to R2, R2 to B.

```quiz
[
  {
    "q": "Which header stack leaves A's data-link layer?",
    "options": [
      "$H_L\\ H_N\\ H_T\\ M$",
      "$H_N\\ H_T\\ M$",
      "$H_T\\ H_N\\ H_L\\ M$",
      "$H_L\\ M$"
    ],
    "answer": 0,
    "explain": "Each layer adds its header in front of what it got from above: $M$, then $H_T\\ M$ (segment), then $H_N\\ H_T\\ M$ (datagram), then $H_L\\ H_N\\ H_T\\ M$ (frame)."
  },
  {
    "q": "How many different link-layer headers does the message carry on its way from A to B?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "explain": "One per link. A writes the first $H_L$; R1 strips it and writes a new one for the R1–R2 link; R2 does the same for the R2–B link: 3 link-layer headers."
  },
  {
    "q": "The network-layer header that reaches B is the one A wrote.",
    "type": "tf",
    "answer": true,
    "explain": "Routers read $H_N$ to choose the next link but leave it, $H_T$ and $M$ untouched. Only $H_L$ is replaced at each router."
  },
  {
    "q": "Which header does R2 replace?",
    "options": [
      "Only $H_L$",
      "$H_L$ and $H_N$",
      "$H_N$ only",
      "All three headers"
    ],
    "answer": 0,
    "explain": "R2 runs network, data link and physical. Its data-link layer strips $H_L$, its network layer reads $H_N$, and its data-link layer writes a new $H_L$ for the link to B."
  },
  {
    "type": "match",
    "q": "Match each address seen on this trip to its level.",
    "pairs": [
      [
        "alice@bcit.ca",
        "application: name"
      ],
      [
        "port 8080",
        "transport: port number"
      ],
      [
        "142.232.230.10",
        "network: logical (IP) address"
      ],
      [
        "3C:52:82:1A:7F:09",
        "data link: link-layer (MAC) address"
      ]
    ],
    "explain": "An email address is an application-layer name; a port number identifies a process on a host; a dotted IP address is the logical address of a host on the Internet; the six-byte hexadecimal address is a link-layer (MAC) address, valid in one network and rewritten at each router."
  }
]
```

```quiz
[
  {
    "q": "How many layers of the TCP/IP suite does a switch implement?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "explain": "A switch runs the data-link and physical layers only. A router runs three (network, data link, physical); hosts run all five."
  },
  {
    "q": "How many layers of the TCP/IP suite does a router implement?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "explain": "A router runs network, data link, and physical. It must reach the network layer to read the IP address and route."
  },
  {
    "q": "At the source, the transport layer adds its header to the message and the result is called a _______.",
    "type": "text",
    "answer": ["segment", "segment / user datagram", "user datagram"],
    "explain": "Message + transport header = segment (user datagram for UDP). Adding the network header makes a datagram; adding the link header makes a frame."
  },
  {
    "q": "A router replaces the link-layer header of a frame but leaves the network-layer and transport-layer headers unchanged.",
    "type": "tf",
    "answer": true,
    "explain": "The router strips the old link header, reads the network header to route, and adds a new link header for the next link. Everything above the link header passes through untouched."
  },
  {
    "q": "A switch examines the network-layer header to decide where to send a frame.",
    "type": "tf",
    "answer": false,
    "explain": "A switch only reaches the data-link layer. It uses the link-layer (MAC) addresses in the frame header, not the network-layer header."
  },
  {
    "q": "Match each layer to the kind of address used at that layer.",
    "type": "match",
    "pairs": [
      ["Application", "names (URLs, email addresses)"],
      ["Transport", "port numbers"],
      ["Network", "logical (IP) addresses"],
      ["Data link", "link-layer (MAC) addresses"]
    ],
    "explain": "Four levels of addresses: names at the application layer, port numbers at transport, logical/IP addresses at network, link-layer/MAC addresses at data link. The physical layer has none."
  },
  {
    "q": "A _______ number identifies a process on a host.",
    "type": "text",
    "answer": ["port"],
    "explain": "Port numbers are the transport-layer addresses; they pick out one process (program) on a host."
  },
  {
    "q": "An IP address uniquely defines a host on the Internet.",
    "type": "tf",
    "answer": true,
    "explain": "The logical (IP) address is the network-layer address and is global to the Internet. A link-layer address only identifies a host or router inside one network."
  },
  {
    "q": "The physical layer uses its own kind of address, called a signal address.",
    "type": "tf",
    "answer": false,
    "explain": "There are four levels of addresses, one for each of the top four layers. The physical layer carries bits and has no address."
  },
  {
    "q": "In an internet, the LAN technology is changed to a new one. Which layers of the TCP/IP suite need to change? Select all that apply.",
    "options": ["Application", "Transport", "Network", "Data link", "Physical"],
    "answer": [3, 4],
    "explain": "E01 exercise 2: only the data-link and physical layers. Physical protocols depend on the medium, and the data-link layer handles neighbouring nodes over that medium. The upper layers never touch the medium."
  }
]
```
