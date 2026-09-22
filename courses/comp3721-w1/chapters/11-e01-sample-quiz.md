---
title: E01 & the sample quiz, worked
minutes: 20
---

The instructor posted two pieces of Week 1 practice material: the Week 1 exercise sheet (E01) and one page of sample quiz questions that shows the three formats the real quizzes use (true or false, fill in the blanks, written response). Every item is reproduced here. Commit to an answer on paper before you open the worked answer; checking an answer you never made teaches almost nothing. The Week 2 sheet (E02) is worked in the Week 2 module.

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
    "explain": "Every device has a dedicated link to every other device, so count the pairs: $\\frac{n(n-1)}{2} = \\frac{12 \\times 11}{2} = 66$."
  }
]
```

**Instructor's answer.** In a mesh topology every device has a dedicated point-to-point link to every other device, so the number of links is the number of pairs of devices:

$$\text{links} = \frac{n(n-1)}{2} = \frac{12 \times 11}{2} = 66$$

For a bus topology there is one long cable as a backbone and every device connects to it through its own drop line: **12 drop lines**, and **one backbone** link is needed.

:::quiz Watch the wording
"How many cable links" for a bus is answered as *n drop lines plus one backbone*, not as a single number. Write both parts.
:::

### Exercise 2

> In an internet, we change the LAN technology to a new one. Which layers in the TCP/IP protocol suite need to be changed?

```quiz
[
  {
    "q": "Select every TCP/IP layer that needs to change when the LAN technology is replaced.",
    "options": ["Application", "Transport", "Network", "Data link", "Physical"],
    "answer": [3, 4],
    "explain": "Only the two lowest layers. Physical-layer protocols depend on the transmission medium, and the data-link layer handles communication between neighbouring nodes over that medium. The network, transport and application layers are end-to-end and do not care what the link is made of."
  }
]
```

**Instructor's answer.** The only two layers that need to be changed are the **data-link layer** and the **physical layer**.

Changing the LAN technology usually means changing the transmission medium: from coaxial cable to fibre-optic cable, or to a wireless technology such as WiFi. Physical-layer protocols depend on the transmission medium. The data-link layer is involved in communication between neighbouring nodes, so it is also affected by the medium. Everything above (network, transport, application) is unchanged.

### Exercise 3

> Consider different communication devices (modem, switch and router). A ----- connects a network to other networks, a ----- connects devices (end systems) together, and a ----- changes the form of data.

```quiz
[
  {
    "q": "Fill in the first blank: a ________ connects a network to other networks.",
    "type": "text",
    "answer": ["router"],
    "explain": "A router is an internetworking device: it operates at the network layer and connects independent networks to form an internet."
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

**Instructor's answer.** **Router, switch, modem** (modulator-demodulator).

### Exercise 4

> A router is a ----- layer communication device and the addresses at this layer are called -----.

```quiz
[
  {
    "q": "Fill in the first blank: a router is a ________ layer device.",
    "type": "text",
    "answer": ["network", "network layer", "network-layer"],
    "explain": "A router routes datagrams from source host to destination host, which is the job of the network layer."
  },
  {
    "q": "Fill in the second blank: the addresses at that layer are called ________.",
    "type": "text",
    "answer": ["IP addresses", "IP address", "logical addresses", "logical address", "IP"],
    "explain": "Network-layer addresses are IP addresses, also called logical addresses. Link-layer (MAC) addresses belong one layer down."
  }
]
```

**Instructor's answer.** **Network**, **IP addresses** (or logical addresses).

Although a router is generally considered a network-layer device, it operates at the **network, data-link and physical** layers (three layers). The network layer depends on the services of the layer below it, the data-link layer, which in turn relies on the services of the physical layer. So any network-layer device must implement all three.

:::quiz Two different questions
"At which layer does a router operate?" has the one-word answer *network*. "How many layers does a router implement?" is *three*. A switch implements *two* (data link and physical). Read which of the two is being asked.
:::

## Sample quiz questions

The instructor's sample page has six questions: two true or false, two fill in the blanks, two written response. Each is reproduced verbatim.

### 1. True or false

> In full-duplex mode of communication, signals going in one direction share the capacity of the link with signals going in the other direction.

```quiz
[
  {
    "q": "In full-duplex mode of communication, signals going in one direction share the capacity of the link with signals going in the other direction.",
    "type": "tf",
    "answer": true,
    "explain": "True. In full-duplex both directions transmit at the same time over one link, so the link's capacity is shared between the two directions (either two physical paths or one path with the capacity divided)."
  }
]
```

:::quiz Model answer
**True.** Full-duplex means two-directional communication *simultaneously*. Both directions use the same link at the same time, so its capacity is shared between them. (Half-duplex avoids the sharing by taking turns; simplex only ever has one direction.)
:::

### 2. True or false

> Data-link layer transforms bits to electromagnetic signals.

```quiz
[
  {
    "q": "Data-link layer transforms bits to electromagnetic signals.",
    "type": "tf",
    "answer": false,
    "explain": "False. Transforming the bits of a frame into signals on the transmission medium is the physical layer's job. The data-link layer moves frames between neighbouring nodes."
  }
]
```

:::quiz Model answer
**False.** That is the **physical layer**: the bits received in a frame from the data-link layer are transformed to signals and sent through the transmission medium. The data-link layer's PDU is the frame; it never touches signals.
:::

### 3. Fill in the blanks

> Assume we have a dedicated link between two devices. This type of connection is called _______.

```quiz
[
  {
    "q": "Assume we have a dedicated link between two devices. This type of connection is called _______.",
    "type": "text",
    "answer": ["point-to-point", "point to point", "point-to-point connection", "point to point connection"],
    "explain": "A point-to-point connection is a dedicated link between two devices; the capacity of the link is reserved for transmission between those two. The alternative, multipoint, shares one link among more than two devices."
  }
]
```

:::quiz Model answer
**Point-to-point.** Dedicated link, capacity reserved for the two devices (wire, microwave or satellite links; the TV remote example).
:::

### 4. Fill in the blanks

> _______ layer of TCP/IP protocol suite provides host-to-host communication.

```quiz
[
  {
    "q": "_______ layer of TCP/IP protocol suite provides host-to-host communication.",
    "type": "text",
    "answer": ["network", "network layer", "the network"],
    "explain": "The network layer routes datagrams from the source host to the destination host. Process-to-process delivery is the transport layer, one level up."
  }
]
```

:::quiz Model answer
**Network** layer (routing of datagrams from source to destination, host-to-host). Contrast: **transport** = process-to-process; **data link** = node-to-node between neighbours.
:::

### 5. Written response

> List two disadvantages of star topology.

```quiz
[
  {
    "q": "Select the two disadvantages of a star topology given in the lecture.",
    "options": ["The dependency of the whole topology on one single point", "Expensive hardware", "More cabling is required compared with bus and ring", "Difficult fault isolation"],
    "answer": [0, 2],
    "explain": "The slide lists exactly two: dependency of the whole topology on one single point (the hub), and more cabling than bus and ring. Expensive hardware is a mesh disadvantage; difficult fault isolation is a bus disadvantage."
  }
]
```

:::quiz Model answer
1. The **dependency of the whole topology on one single point** (the hub): if the hub fails, the whole network is down.
2. **More cabling is required** compared with bus and ring.
:::

### 6. Written response

> What is the responsibility of data-link layer in TCP/IP protocol suite?

```quiz
[
  {
    "q": "What is the responsibility of the data-link layer in the TCP/IP protocol suite?",
    "options": ["Data transfer between neighbouring network elements or devices (node to node), without errors", "Routing datagrams from the source host to the destination host", "Transforming bits into signals on the transmission medium", "Process-to-process delivery of the entire message"],
    "answer": 0,
    "explain": "The data-link layer moves frames between neighbouring nodes over one link, without errors. Routing is the network layer, bits to signals is the physical layer, process-to-process is the transport layer."
  }
]
```

:::quiz Model answer
The data-link layer is responsible for **data transfer between neighbouring network elements or devices** (node-to-node delivery across a single link), **without errors**. Its PDU is the **frame**; example protocols are Ethernet and 802.11 (WiFi).
:::
