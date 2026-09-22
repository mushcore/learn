---
title: Topologies: mesh, star, bus, ring
minutes: 16
---

The **topology** of a network is *the geometric representation of the relationship of all the links and linking devices (nodes) to one another.* The lecture covers **four basic network topologies**: mesh, star, bus, ring. For each one you need the definition, the advantage and disadvantage lists, and how many cable links it takes for $n$ devices.

## Mesh

> Every device has a **dedicated point-to-point link to every other device.**

```widget
topology
{ "type": "mesh", "n": 6, "title": "Mesh: every device linked to every other" }
```

Drag the slider: the number of links grows much faster than the number of devices. Each new device needs a link to *every* existing device.

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

Devices do not talk to each other directly; everything goes through the hub. One link per device.

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

:::quiz Sample quiz question (written response)
The instructor's sample quiz asks: **"List two disadvantages of star topology."** Model answer, straight from the slide:

1. The dependency of the whole topology on **one single point** (the hub): if the hub fails, the whole network is down.
2. **More cabling** is required compared with bus and ring.

Notice that "more cabling" is relative. Star uses *less* cabling than mesh (an advantage) but *more* than bus and ring (a disadvantage). A true/false question can be built on either half.
:::

## Bus

> **Multipoint**: one long cable as a **backbone** to link all the devices in a network.

- **Drop lines** and **taps** connect nodes to the cable.
- There is a **limit on the number of taps** a bus can support and on the **distance between taps**.

**Advantages**

- ease of installation
- less cabling than mesh and star

**Disadvantages**

- difficult reconnection and adding new devices
- difficult fault isolation

**Links for $n$ devices:** *one backbone line and $n$ drop lines are needed.* This is the one topology whose answer is not a single number; give both parts.

## Ring

> Each device has a **dedicated point-to-point connection with only the two devices on either side of it.**

- A **repeater** for each device.

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

Two facts to hold together:

- **Bus** is the only *multipoint* topology; the other three are built from *point-to-point* links.
- **Mesh** is the only one where the link count grows faster than $n$.

## Worked: E01 exercise 1

*Consider a network with 12 devices. If these devices are arranged in a mesh topology, how many cable links are needed? How about the number of links in a bus topology?*

- Mesh: $\frac{12 \times (12 - 1)}{2} = \frac{12 \times 11}{2} = \mathbf{66}$ cable links.
- Bus: **12 drop lines**, and also **one backbone** link is needed.

Set the widget to mesh with 12 devices to see all 66 links drawn.

:::warn Show the formula
On a quiz, write $\frac{n(n-1)}{2}$ before the number. A bare "66" with the wrong formula earns nothing on a written response, and the formula alone can earn part marks if you slip on the arithmetic.
:::

## Try it

```quiz
[
  {
    "q": "A network with 12 devices is arranged in a mesh topology. How many cable links are needed?",
    "type": "numeric",
    "answer": 66,
    "tolerance": 0,
    "explain": "Mesh links $= \\frac{n(n-1)}{2} = \\frac{12 \\times 11}{2} = 66$. This is E01 exercise 1."
  },
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
    "q": "In a bus topology with 12 devices, how many drop lines are needed (not counting the backbone)?",
    "type": "numeric",
    "answer": 12,
    "tolerance": 0,
    "explain": "One drop line per device, so 12 drop lines, plus **one backbone** line. E01's answer gives both parts."
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
      "The dependency of the whole topology on one single point",
      "More cabling is required compared with bus and ring",
      "Expensive hardware",
      "Difficult fault isolation",
      "Unidirectional traffic"
    ],
    "answer": [0, 1],
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
      "Each connection can carry its own data load (dedicated links)",
      "Robustness",
      "Privacy and security",
      "Ease of fault identification and fault isolation",
      "Ease of installation",
      "Less cabling"
    ],
    "answer": [0, 1, 2, 3],
    "explain": "Mesh advantages: dedicated links carry their own data load, robustness, privacy and security, ease of fault identification and isolation. Installation is *difficult* and wiring is a *disadvantage* for mesh."
  },
  {
    "q": "Every device in a ring topology needs a repeater.",
    "type": "tf",
    "answer": true,
    "explain": "The ring slide says 'a repeater for each device'. Each device regenerates the signal and passes it to the next neighbour."
  },
  {
    "q": "Which topology is multipoint rather than built from point-to-point links?",
    "options": ["Mesh", "Star", "Bus", "Ring"],
    "answer": 2,
    "explain": "**Bus** is described as multipoint: all devices share the one backbone cable. Mesh, star and ring are all made of dedicated point-to-point links."
  }
]
```
