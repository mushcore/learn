---
title: Networks: nodes, criteria, connections
minutes: 12
---

A data communications system connects two devices. A **network** connects many. This lesson covers the lecture's vocabulary for networks, the three criteria a network is judged by, and the two ways a link can be connected.

## What is a network?

The slide builds the definition in three steps, with a railway map as the picture:

- A **network** is *a system or structure composed of interconnected nodes or entities using some links.*
- **Nodes** are *individual entities or points within a network*, like **stations**.
- **Edges** are *links or connections* that represent the relationships or interactions between nodes, like **railways**.

Stations and the tracks between them: that is the whole idea. Everything else in the course is about what the nodes are and what travels on the edges.

## Computer networks

The lecture then specializes the definition:

> A **network** is *the interconnection of a set of devices capable of communication.*

The nodes become **devices**, of which the slide names two kinds:

| Kind of device (node) | Slide examples |
|---|---|
| **Host (end system)** | a large computer, desktop, laptop, workstation, cellular phone, etc. |
| **Connecting / networking / communication device** | router, switch, modem, etc. |

And the edges become the **connection between devices**: *wired or wireless transmission media such as cable or air.*

:::quiz Host or connecting device?
A phone is a **host** (end system). A switch is a **connecting device**. If a question asks for "an example of an end system", answer with a computer, laptop, workstation or cellular phone; if it asks for "a connecting device", answer router, switch or modem. The three names *connecting device*, *networking device* and *communication device* all mean the same thing on the slide.
:::

## Network criteria

A network must meet three criteria. Each one comes with the specific things it is measured by:

| Criterion | Measured by (slide wording) |
|---|---|
| **Performance** | mainly measured in terms of **throughput** and **delay** |
| **Reliability** | measured by **accuracy of delivery**, **failure rate**, **recovery time from failure**, and the network's **robustness** |
| **Security** | protecting data from **unauthorized access/damage** and implementing **policies and procedures for recovery** from breaches and data losses |

The measurements are as quizzable as the names. "Performance is mainly measured in terms of ___ and ___" wants throughput and delay.

:::warn Two different fours and threes
Do not mix these up with the previous lesson: the *effectiveness of a data communications system* has **four** characteristics (delivery, accuracy, timeliness, jitter); a *network* has **three** criteria (performance, reliability, security). Accuracy appears in both lists, once as a characteristic and once as a measure of reliability.
:::

## Type of connection

Any link in a network is connected in one of two ways.

### Point-to-point

- **A dedicated link between two devices.**
- The **capacity of the link is reserved** for transmission between the two devices.
- Examples on the slide: wire, microwave or satellite links; changing TV channels using the remote control (the remote and the TV have the link to themselves).

### Multipoint (multidrop)

- **More than two devices share a single link.**
- The **capacity of the channel is shared**, in one of two ways:
  - **spatially shared**: several devices can use the link **simultaneously**;
  - **timeshared**: users must **take turns**.

The slide's text does not spell out the name "multipoint" next to the definition; the name comes from the textbook (Forouzan §1.2, assigned reading), where it is also called multidrop. The definition and the two ways of sharing are on the slide.

:::quiz Sample quiz question (fill in the blank)
The instructor's sample quiz asks: *"Assume we have a dedicated link between two devices. This type of connection is called ___."* The answer is **point-to-point**. The words that trigger it are *dedicated* and *two devices*; if the question says *more than two devices share a single link*, the answer is **multipoint**.
:::

## Try it

```quiz
[
  {
    "q": "Assume we have a dedicated link between two devices. This type of connection is called ___.",
    "type": "text",
    "answer": ["point-to-point", "point to point", "point-to-point connection"],
    "explain": "A **point-to-point** connection is a dedicated link between two devices, with the capacity of the link reserved for those two. This is the instructor's sample quiz question."
  },
  {
    "q": "A connection in which more than two devices share a single link is called ___.",
    "type": "text",
    "answer": ["multipoint", "multi-point", "multidrop", "multi-drop", "multipoint connection"],
    "explain": "**Multipoint** (also multidrop): more than two devices share a single link, and the channel's capacity is shared, either spatially or by taking turns."
  },
  {
    "q": "In a point-to-point connection, the entire capacity of the link is reserved for transmission between the two devices.",
    "type": "tf",
    "answer": true,
    "explain": "That is the slide's second bullet for point-to-point: the capacity of the link is reserved. Contrast multipoint, where capacity is shared."
  },
  {
    "q": "On a multipoint link, several devices can use the link simultaneously. The slide calls this...",
    "options": ["timeshared", "spatially shared", "point-to-point", "full-duplex"],
    "answer": 1,
    "explain": "**Spatially shared** means several devices use the link at the same time. **Timeshared** means users must take turns. Both are ways of sharing a multipoint link."
  },
  {
    "q": "Which of these are hosts (end systems) according to the slide? Select all that apply.",
    "options": ["Desktop", "Laptop", "Workstation", "Cellular phone", "Router", "Switch", "Modem"],
    "answer": [0, 1, 2, 3],
    "explain": "Hosts (end systems) are large computers, desktops, laptops, workstations, cellular phones. Routers, switches and modems are connecting (networking, communication) devices."
  },
  {
    "q": "Which of these are connecting / networking / communication devices? Select all that apply.",
    "options": ["Router", "Switch", "Modem", "Laptop", "Cellular phone"],
    "answer": [0, 1, 2],
    "explain": "Router, switch and modem are the slide's examples of connecting devices. A laptop and a cellular phone are hosts (end systems)."
  },
  {
    "q": "Network performance is mainly measured in terms of...",
    "options": ["throughput and delay", "cost and cabling", "failure rate and recovery time", "accuracy and jitter"],
    "answer": 0,
    "explain": "**Performance**: mainly measured in terms of throughput and delay. Failure rate and recovery time are measures of *reliability*."
  },
  {
    "q": "Which of these does the slide list as measures of network reliability? Select all that apply.",
    "options": ["Accuracy of delivery", "Failure rate", "Recovery time from failure", "Network's robustness", "Throughput", "Delay"],
    "answer": [0, 1, 2, 3],
    "explain": "Reliability is measured by accuracy of delivery, failure rate, recovery time from failure, and the network's robustness. Throughput and delay measure performance."
  },
  {
    "q": "The network criterion concerned with protecting data from unauthorized access or damage is ___.",
    "type": "text",
    "answer": ["security"],
    "explain": "**Security**: protecting data from unauthorized access/damage and implementing policies and procedures for recovery from breaches and data losses."
  },
  {
    "q": "In the lecture's vocabulary, nodes are the links between stations and edges are the stations themselves.",
    "type": "tf",
    "answer": false,
    "explain": "It is the other way round. **Nodes** are the individual entities or points (like stations); **edges** are the links or connections (like railways)."
  },
  {
    "q": "Changing TV channels with a remote control is the slide's example of a point-to-point connection.",
    "type": "tf",
    "answer": true,
    "explain": "The remote and the TV have a dedicated link between just the two of them, which is the point-to-point idea. The slide lists it alongside wire, microwave and satellite links."
  },
  {
    "q": "The interconnection of a set of devices capable of communication is the slide's definition of a ___.",
    "type": "text",
    "answer": ["network", "computer network"],
    "explain": "A (computer) **network** is the interconnection of a set of devices capable of communication; the devices are the nodes and the wired or wireless media are the edges."
  }
]
```
