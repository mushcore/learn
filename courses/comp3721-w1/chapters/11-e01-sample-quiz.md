---
title: E01 & the sample quiz, worked
minutes: 18
---

The Week 1 exercise sheet (E01) and the instructor's one page of sample quiz questions, in the three formats the real quizzes use: true or false, fill in the blanks, written response. Each instructor's answer is in the explanation, shown after you check.

## E01: Week 1 exercises

### Exercise 1

> Consider a network with 12 devices. If these devices are arranged in a mesh topology, how many cable links are needed? How about the number of links in a bus topology?

```quiz
[
  {
    "q": "Mesh topology, 12 devices: how many cable links are needed?",
    "type": "numeric",
    "answer": 66,
    "tolerance": 0.5,
    "unit": "links",
    "explain": "Instructor's answer: in a mesh topology every device has a dedicated point-to-point link to every other device, so the number of links is the number of pairs of devices: $\\frac{n(n-1)}{2} = \\frac{12 \\times 11}{2} = 66$."
  },
  {
    "q": "Bus topology, 12 devices: how many drop lines are needed? (The written answer also names the other link.)",
    "type": "numeric",
    "answer": 12,
    "tolerance": 0,
    "unit": "drop lines",
    "explain": "Instructor's answer: a bus has one long cable as a backbone and every device connects to it through its own drop line, so **12 drop lines, and one backbone** link is needed. The bus answer is *n drop lines plus one backbone*, not a single number."
  }
]
```

### Exercise 2

> In an internet, we change the LAN technology to a new one. Which layers in the TCP/IP protocol suite need to be changed?

```quiz
[
  {
    "q": "Select every TCP/IP layer that needs to change when the LAN technology is replaced.",
    "options": ["Application", "Data link", "Transport", "Network", "Physical"],
    "answer": [1, 4],
    "explain": "Instructor's answer: the only two layers that need to be changed are the **data-link layer** and the **physical layer**. Changing the LAN technology usually means changing the transmission medium: from coaxial cable to fibre-optic cable, or to a wireless technology such as WiFi. Physical-layer protocols depend on the transmission medium, and the data-link layer is involved in communication between neighbouring nodes, so it is also affected. Network, transport and application are end-to-end and do not care what the link is made of."
  }
]
```

### Exercise 3

> Consider different communication devices (modem, switch and router). A ----- connects a network to other networks, a ----- connects devices (end systems) together, and a ----- changes the form of data.

```quiz
[
  {
    "q": "Fill in the first blank: a ________ connects a network to other networks.",
    "type": "text",
    "answer": ["router"],
    "explain": "Instructor's answer: **router, switch, modem**. A router is an internetworking device: it operates at the network layer and connects independent networks to form an internet."
  },
  {
    "q": "Fill in the second blank: a ________ connects devices (end systems) together.",
    "type": "text",
    "answer": ["switch", "link-layer switch", "link layer switch"],
    "explain": "A switch works at the data-link layer and connects end systems inside one network, choosing the outgoing port from the destination MAC address."
  },
  {
    "q": "Fill in the third blank: a ________ changes the form of data.",
    "type": "text",
    "answer": ["modem"],
    "explain": "Modem is short for modulator-demodulator: it converts data between the forms used on two different media."
  }
]
```

### Exercise 4

> A router is a ----- layer communication device and the addresses at this layer are called -----.

```quiz
[
  {
    "q": "Fill in the first blank: a router is a ________ layer device.",
    "type": "text",
    "answer": ["network", "network layer", "network-layer"],
    "explain": "Instructor's answer: **network**. Although a router is generally considered a network-layer device, it operates at the network, data-link and physical layers: the network layer depends on the services of the data-link layer, which relies on the physical layer, so any network-layer device must implement all three. \"At which layer does a router operate?\" is network; \"how many layers does it implement?\" is three (a switch implements two)."
  },
  {
    "q": "Fill in the second blank: the addresses at that layer are called ________.",
    "type": "text",
    "answer": ["IP addresses", "IP address", "logical addresses", "logical address", "IP"],
    "explain": "Instructor's answer: **IP addresses** (or logical addresses). Link-layer (MAC) addresses belong one layer down."
  }
]
```

## Sample quiz questions

Six questions: two true or false, two fill in the blanks, two written response, reproduced verbatim. A written response is graded here by its key words; the full model answer is in the explanation.

### 1. True or false

> In full-duplex mode of communication, signals going in one direction share the capacity of the link with signals going in the other direction.

```quiz
[
  {
    "q": "In full-duplex mode of communication, signals going in one direction share the capacity of the link with signals going in the other direction.",
    "type": "tf",
    "answer": true,
    "explain": "**True.** Full-duplex means two-directional communication *simultaneously*. Both directions use the same link at the same time, so its capacity is shared between them (two physical paths, or one path with the capacity divided). Half-duplex avoids the sharing by taking turns; simplex only ever has one direction."
  }
]
```

### 2. True or false

> Data-link layer transforms bits to electromagnetic signals.

```quiz
[
  {
    "q": "Data-link layer transforms bits to electromagnetic signals.",
    "type": "tf",
    "answer": false,
    "explain": "**False.** That is the **physical layer**: the bits received in a frame from the data-link layer are transformed to signals and sent through the transmission medium. The data-link layer moves frames between neighbouring nodes; it never touches signals."
  }
]
```

### 3. Fill in the blanks

> Assume we have a dedicated link between two devices. This type of connection is called _______.

```quiz
[
  {
    "q": "Assume we have a dedicated link between two devices. This type of connection is called _______.",
    "type": "text",
    "answer": ["point-to-point", "point to point", "point-to-point connection", "point to point connection"],
    "explain": "**Point-to-point.** A dedicated link between two devices; the capacity of the link is reserved for transmission between those two (wire, microwave or satellite links; the TV remote example). The alternative, multipoint, shares one link among more than two devices."
  }
]
```

### 4. Fill in the blanks

> _______ layer of TCP/IP protocol suite provides host-to-host communication.

```quiz
[
  {
    "q": "_______ layer of TCP/IP protocol suite provides host-to-host communication.",
    "type": "text",
    "answer": ["network", "network layer", "the network"],
    "explain": "**Network** layer: routing of datagrams from source to destination, host-to-host. Contrast: **transport** = process-to-process; **data link** = node-to-node between neighbours."
  }
]
```

### 5. Written response

> List two disadvantages of star topology.

```quiz
[
  {
    "q": "Written response, first disadvantage: the dependency of the whole topology on one single ________.",
    "type": "text",
    "answer": ["point", "single point", "point (the hub)", "hub", "the hub", "device", "central controller"],
    "explain": "Model answer: (1) the **dependency of the whole topology on one single point** (the hub): if the hub fails, the whole network is down; (2) **more cabling is required** compared with bus and ring."
  },
  {
    "q": "Written response, second disadvantage: more ________ is required compared with bus and ring.",
    "type": "text",
    "answer": ["cabling", "cable", "cables", "wiring"],
    "explain": "More cabling than bus and ring. It is relative: star needs less cabling than mesh, which is one of its advantages."
  },
  {
    "q": "Which of these is a disadvantage of the star topology rather than of another topology?",
    "options": ["Expensive hardware", "Difficult fault isolation", "The dependency of the whole topology on one single point", "Unidirectional traffic"],
    "answer": 2,
    "explain": "Dependency on one single point is star's. Expensive hardware is a mesh disadvantage, difficult fault isolation is a bus disadvantage, and unidirectional traffic is the ring's."
  }
]
```

### 6. Written response

> What is the responsibility of data-link layer in TCP/IP protocol suite?

```quiz
[
  {
    "q": "Written response, key word: the data-link layer is responsible for data transfer between ________ network elements or devices.",
    "type": "text",
    "answer": ["neighbouring", "neighboring", "neighbour", "neighbor", "adjacent"],
    "explain": "Model answer: the data-link layer is responsible for **data transfer between neighbouring network elements or devices** (node-to-node delivery across a single link), **without errors**. Its PDU is the **frame**; example protocols are Ethernet and 802.11 (WiFi)."
  },
  {
    "q": "Which of these is the responsibility of the data-link layer?",
    "options": ["Routing datagrams from the source host to the destination host", "Transforming bits into signals on the transmission medium", "Data transfer between neighbouring network elements or devices (node to node), without errors", "Process-to-process delivery of the entire message"],
    "answer": 2,
    "explain": "The data-link layer moves frames between neighbouring nodes over one link, without errors. Routing is the network layer, bits to signals is the physical layer, process-to-process is the transport layer."
  }
]
```
