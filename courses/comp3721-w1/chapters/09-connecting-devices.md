---
title: Hubs, switches, routers
minutes: 10
---

Lecture 01c is a one-page note on **connecting (communication) devices**: the hardware behind the layer counts of the previous lesson, and behind E01 exercises 3 and 4.

## Why connecting devices exist

We use connecting devices to **connect hosts together to make a network**, or to **connect networks together to make an internet**. They operate in different layers of the Internet model. There are **three main types**: **hubs**, **link-layer switches**, and **routers**. The layer a device reaches decides what it can read, and so what it can decide:

| Device | Layers | What it reads | What it decides |
|---|---|---|---|
| **Hub** | physical (1) | nothing, just the signal | nothing: repeats to every other port |
| **Link-layer switch** | physical + data link (1–2) | source and destination **MAC addresses** in the frame | which **outgoing port** gets the frame (filtering) |
| **Router** | physical + data link + network (1–3) | link-layer addresses **and** network-layer (IP) addresses | which **network** the packet goes to next |

## Hub

Hubs today operate in the **physical layer** (first layer) of the TCP/IP protocol suite.

- A hub just **repeats whatever it hears on one port out all its other ports**.
- A hub is also called a **multiport (multiway) repeater**.
- It forwards the signal to **all outgoing ports except the one from which the signal was received**.

## Link-layer switch

Link-layer switches operate in the **first two layers** (physical layer and data-link layer).

- As a **physical-layer device**, it **regenerates** the signal it receives.
- As a **link-layer device**, it can **check the MAC addresses (source and destination)** contained in the frame.
- In general, we refer to a switch as a **link-layer device**.
- A link-layer switch has **filtering capability**: it can check the destination address of a frame and **decide from which outgoing port the frame should be sent**. That is the **difference with a hub**.

## Router

Routers operate in the **first three layers** (physical, data link, and network).

- As a physical-layer device, it **regenerates** the signal it receives.
- As a link-layer device, it **checks the physical (link-layer) addresses** (source and destination) contained in the packet.
- As a network-layer device, it **checks the network-layer addresses**.

A router **can connect networks**: it is an **internetworking device**, connecting independent networks to form an internetwork. **Two networks connected by a router become an internetwork or an internet**.

## Three differences: router vs. repeater or switch

The note numbers exactly three:

1. A router has a **physical address (link-layer / MAC address)** as well as a **logical (IP) address** for **each of its interfaces**.
2. A router **acts only on those packets in which the link-layer destination address matches the address of the interface** at which the packet arrives.
3. A router **changes the link-layer address of the packet (both source and destination)** when it forwards the packet.

Difference 3 is the $H_L$ replacement from the encapsulation lesson; difference 1 is what makes it possible, since the router has its own MAC address on each interface to write into the new header. A router joining three networks has three link-layer addresses and three IP addresses, not one of each.

## E01 exercise 3

*Consider different communication devices (modem, switch and router). A ----- connects a network to other networks, a ----- connects devices (end systems) together, and a ----- changes the form of data.*

**Answer: router, switch, modem** (modulator-demodulator).

- **Router**: connects a network to other networks (internetworking device).
- **Switch**: connects end systems together inside a network.
- **Modem**: changes the form of data, converting between a computer's digital data and the analog signal of a phone or cable line. Modulation itself is Week 5 material.

## E01 exercise 4

*A router is a ----- layer communication device and the addresses at this layer are called -----.*

**Answer: network, IP addresses (or logical addresses).**

Although a router is generally considered a **network-layer device**, it operates at the **network layer, data-link layer, and physical layer**. The network layer depends on the services of the data-link layer, which relies on the physical layer, so **any network-layer device must implement all three layers**. Asked what layer a device belongs to, give the highest layer it reaches: hub = physical, switch = data link, router = network. Asked how many layers it implements, count from the bottom: 1, 2, 3.

## Try it

```quiz
[
  {
    "q": "A hub operates in the _______ layer of the TCP/IP protocol suite.",
    "type": "text",
    "answer": ["physical", "physical layer", "first"],
    "explain": "Hubs operate in the physical layer only. A hub repeats whatever it hears on one port out all other ports; it is a multiport repeater."
  },
  {
    "q": "A hub forwards an incoming signal to all of its ports, including the one it arrived on.",
    "type": "tf",
    "answer": false,
    "explain": "A hub forwards the signal to all outgoing ports except the one from which the signal was received."
  },
  {
    "q": "A hub is also called a multiport (multiway) _______.",
    "type": "text",
    "answer": ["repeater"],
    "explain": "Because it regenerates and repeats the signal out every other port, a hub is a multiport repeater."
  },
  {
    "q": "What gives a link-layer switch its filtering capability?",
    "options": [
      "It reads the destination MAC address in the frame and chooses one outgoing port",
      "It reads the destination IP address in the datagram",
      "It measures signal strength on each port",
      "It reads the port number in the segment"
    ],
    "answer": 0,
    "explain": "A switch operates up to the data-link layer, so it can check the source and destination MAC addresses in a frame and decide which outgoing port to use. That is the difference from a hub."
  },
  {
    "q": "A link-layer switch operates in the physical and data-link layers.",
    "type": "tf",
    "answer": true,
    "explain": "As a physical-layer device it regenerates the signal; as a link-layer device it checks MAC addresses. Two layers."
  },
  {
    "q": "A router operates in how many layers of the TCP/IP protocol suite?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "explain": "Physical, data link, and network. A network-layer device must implement all three because each layer depends on the one below."
  },
  {
    "q": "A _______ connects a network to other networks; a _______ connects end systems together; a _______ changes the form of data.",
    "options": ["switch, router, modem", "router, switch, modem", "modem, switch, router", "router, modem, switch"],
    "answer": 1,
    "explain": "E01 exercise 3: router (internetworking device), switch (connects end systems), modem (modulator-demodulator, changes the form of data)."
  },
  {
    "q": "A router is a _______-layer communication device.",
    "type": "text",
    "answer": ["network", "network layer"],
    "explain": "E01 exercise 4: a router is a network-layer device, and the addresses at that layer are IP (logical) addresses."
  },
  {
    "q": "The addresses used at the router's layer are called _______ addresses.",
    "type": "text",
    "answer": ["IP", "logical", "IP (logical)", "logical (IP)"],
    "explain": "Network-layer addresses are logical addresses, i.e. IP addresses."
  },
  {
    "q": "Two networks connected by a router become an internetwork (an internet).",
    "type": "tf",
    "answer": true,
    "explain": "A router is an internetworking device; connecting independent networks with a router forms an internetwork, which is what the lower-case word internet means."
  },
  {
    "q": "Select all of the three differences between a router and a repeater or switch listed in the notes.",
    "options": [
      "A router has a link-layer address and an IP address for each of its interfaces",
      "A router acts only on packets whose link-layer destination address matches the arriving interface",
      "A router changes the link-layer source and destination addresses when it forwards a packet",
      "A router changes the IP source and destination addresses when it forwards a packet"
    ],
    "answer": [0, 1, 2],
    "explain": "The three differences: two addresses per interface; acts only on frames addressed to the arriving interface; rewrites the link-layer (not IP) addresses when forwarding."
  },
  {
    "q": "A router has a single MAC address and a single IP address shared by all of its interfaces.",
    "type": "tf",
    "answer": false,
    "explain": "Difference 1: a router has a physical (MAC) address as well as a logical (IP) address for each of its interfaces."
  }
]
```
