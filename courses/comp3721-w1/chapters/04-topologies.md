---
title: Topologies: mesh, star, bus, ring
minutes: 14
---

The **topology** of a network is *the geometric representation of the relationship of all the links and linking devices (nodes) to one another.* The lecture covers **four basic network topologies**: mesh, star, bus, ring. For each you need the definition, the advantage and disadvantage lists, and the number of cable links for $n$ devices.

## Mesh

> Every device has a **dedicated point-to-point link to every other device.**

```widget
topology
{ "type": "mesh", "n": 6, "title": "Mesh: every device linked to every other" }
```

Each new device needs a link to every existing device.

**Advantages**

- guaranteeing that each connection can carry its own data load, due to dedicated links
- robustness
- privacy and security
- ease of fault identification and fault isolation

**Disadvantages**

- difficult installation and reconnection
- wiring can be greater than the available space
- expensive hardware

**Links for $n$ devices.** Every pair of devices needs one link, so the count is the number of pairs:

$$C(n,2) = \frac{n(n-1)}{2}$$

For example, $n = 5$ gives $\frac{5 \times 4}{2} = 10$ links.

## Star

> Each device has a **dedicated point-to-point link only to a central controller**, usually called a **hub**.

```widget
topology
{ "type": "star", "n": 6, "title": "Star: every device linked only to the hub" }
```

Devices do not talk to each other directly; everything goes through the hub.

**Advantages**

- less expensive than mesh
- ease of installation and reconfiguration
- less cabling
- robustness
- easy fault identification and fault isolation

**Disadvantages**

- the dependency of the whole topology on one single point
- more cabling is required compared with bus and ring

**Links for $n$ devices:** $n$ (one per device, to the hub).

"More cabling" is relative: star needs less cabling than mesh (an advantage) but more than bus and ring (a disadvantage).

## Bus

> **Multipoint**: one long cable as a **backbone** to link all the devices in a network.

- **Drop lines** and **taps** connect nodes to the cable.
- There is a **limit on the number of taps** a bus can support and on the **distance between taps**.

```widget
topology
{ "type": "bus", "n": 6, "title": "Bus: one backbone, a drop line and a tap per device" }
```

**Advantages**

- ease of installation
- less cabling than mesh and star

**Disadvantages**

- difficult reconnection and adding new devices
- difficult fault isolation

**Links for $n$ devices:** *one backbone line and $n$ drop lines are needed.* The answer is not a single number; give both parts.

## Ring

> Each device has a **dedicated point-to-point connection with only the two devices on either side of it.**

- A **repeater** for each device.

```widget
topology
{ "type": "ring", "n": 6, "title": "Ring: each device linked to its two neighbours" }
```

**Advantages**

- ease of installation and reconfiguration
- ease of fault isolation

**Disadvantages**

- **unidirectional traffic**: a break in the ring can disable the whole network

**Links for $n$ devices:** $n$ (each device connects to its next neighbour, and the last link closes the ring). The slide does not print this number, but it follows from the definition.

## The four side by side

| Topology | Connection type | Links for $n$ devices | Cabling, least to most |
|---|---|---|---|
| Bus | multipoint | 1 backbone + $n$ drop lines | least |
| Ring | point-to-point to two neighbours | $n$ | |
| Star | point-to-point to the hub | $n$ | more than bus and ring |
| Mesh | point-to-point to every device | $\frac{n(n-1)}{2}$ | most |

## E01 exercise 1: 12 devices

*Consider a network with 12 devices. If these devices are arranged in a mesh topology, how many cable links are needed? How about the number of links in a bus topology?*

```widget
topology
{ "type": "mesh", "n": 12, "title": "E01 exercise 1: 12 devices in a mesh, then on a bus" }
```

The written answer gives the formula and both bus parts; it is worked in [E01 and the sample quiz](#/comp3721-w1/e01-sample-quiz).

## Count the links for five more networks

Mesh is one link per pair, star and ring one per device, bus one backbone plus a drop line per device.

```quiz
[
  {
    "q": "A network with 15 devices is arranged in a mesh topology. How many cable links are needed?",
    "type": "numeric",
    "answer": 105,
    "tolerance": 0,
    "explain": "$\\frac{n(n-1)}{2} = \\frac{15 \\times 14}{2} = \\frac{210}{2} = 105$ links."
  },
  {
    "q": "A network with 11 devices is arranged in a ring. How many cable links are needed?",
    "type": "numeric",
    "answer": 11,
    "tolerance": 0,
    "explain": "Each device links to its next neighbour and the last link closes the ring: $n = 11$ links."
  },
  {
    "q": "A bus topology connects 20 devices. How many cable lines are needed in all, counting the backbone?",
    "type": "numeric",
    "answer": 21,
    "tolerance": 0,
    "explain": "One backbone line and $n = 20$ drop lines: $1 + 20 = 21$. A written answer names both parts: 20 drop lines and 1 backbone."
  },
  {
    "q": "A full mesh has 120 links. How many devices does it connect?",
    "type": "numeric",
    "answer": 16,
    "tolerance": 0,
    "explain": "Solve $\\frac{n(n-1)}{2} = 120$: $n(n-1) = 240 = 16 \\times 15$, so $n = 16$. Check: $\\frac{16 \\times 15}{2} = 120$."
  },
  {
    "q": "A mesh of 14 devices gains a 15th device. How many new links must be installed?",
    "type": "numeric",
    "answer": 14,
    "tolerance": 0,
    "explain": "The new device needs a dedicated link to every existing device: 14 new links. Check: $\\frac{15 \\times 14}{2} - \\frac{14 \\times 13}{2} = 105 - 91 = 14$."
  }
]
```

```quiz
[
  {
    "q": "A network with 8 devices is arranged in a mesh topology. How many cable links are needed?",
    "type": "numeric",
    "answer": 28,
    "tolerance": 0,
    "explain": "$\\frac{8 \\times 7}{2} = 28$ links, one for each pair of devices."
  },
  {
    "q": "A network with 10 devices is arranged in a star topology. How many cable links are needed?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0,
    "explain": "In a star each device has exactly one dedicated link, to the hub, so $n = 10$ links."
  },
  {
    "q": "In a bus topology with 9 devices, how many drop lines are needed (not counting the backbone)?",
    "type": "numeric",
    "answer": 9,
    "tolerance": 0,
    "explain": "One drop line per device, so 9 drop lines, plus **one backbone** line. A written answer gives both parts, as E01's does."
  },
  {
    "q": "In a ___ topology, each device has a dedicated point-to-point link to every other device.",
    "type": "text",
    "answer": ["mesh"],
    "explain": "That is the **mesh** definition. Its link count is $\\frac{n(n-1)}{2}$."
  },
  {
    "q": "In a star topology, each device has a dedicated point-to-point link only to a central controller, usually called a ___.",
    "type": "text",
    "answer": ["hub"],
    "explain": "The central controller in a star is usually called a **hub**. The whole topology depends on it, which is the first disadvantage."
  },
  {
    "q": "Which of these are disadvantages of the star topology listed on the slide? Select all that apply.",
    "options": [
      "Expensive hardware",
      "The dependency of the whole topology on one single point",
      "Difficult fault isolation",
      "More cabling is required compared with bus and ring",
      "Unidirectional traffic"
    ],
    "answer": [1, 3],
    "explain": "Star's two disadvantages: dependency on one single point, and more cabling than bus and ring. Expensive hardware is a mesh disadvantage, difficult fault isolation is a bus disadvantage, unidirectional traffic is a ring disadvantage."
  },
  {
    "q": "The star topology requires less cabling than the mesh topology.",
    "type": "tf",
    "answer": true,
    "explain": "'Less cabling' and 'less expensive than mesh' are star advantages. Star needs $n$ links; mesh needs $\\frac{n(n-1)}{2}$."
  },
  {
    "q": "Which topology uses one long cable as a backbone, with drop lines and taps connecting the nodes?",
    "options": ["Mesh", "Star", "Bus", "Ring"],
    "answer": 2,
    "explain": "**Bus** is the multipoint topology: one backbone cable, with drop lines and taps. There is a limit on the number of taps and the distance between them."
  },
  {
    "q": "In a ring topology, a break in the ring can disable the whole network because the traffic is ___.",
    "type": "text",
    "answer": ["unidirectional", "one-directional", "one directional"],
    "explain": "Ring traffic is **unidirectional**, so a single break stops everything downstream of it. That is the ring's listed disadvantage."
  },
  {
    "q": "Which of these are advantages of the mesh topology on the slide? Select all that apply.",
    "options": [
      "Robustness",
      "Ease of installation",
      "Each connection can carry its own data load (dedicated links)",
      "Privacy and security",
      "Less cabling",
      "Ease of fault identification and fault isolation"
    ],
    "answer": [0, 2, 3, 5],
    "explain": "Mesh advantages: dedicated links carry their own data load, robustness, privacy and security, ease of fault identification and isolation. Installation is *difficult* and wiring is a *disadvantage* for mesh."
  }
]
```
