---
title: "ARP: mapping an IP address to a MAC address"
minutes: 16
---

The forwarding table tells a node the IP address of the next node, but the frame needs that node's MAC address. ARP is the question-and-answer protocol that turns one into the other.

## The question ARP answers

Slide 22, looking back at the small internet: *How does each node acquire the MAC address of the next node on the path from source to destination?* Alice knows she must send to R1 (its IP address $N_2$ came from her forwarding table), but the frame's first field must be $L_2$, and nothing has told her $L_2$ yet.

## What ARP is

Slide wording (slide 23), **Address Resolution Protocol (ARP)**:

- *Useful when moving a frame through a link.*
- *One of the auxiliary protocols defined in the network layer.* It serves the data-link layer, but the course places it in the network layer.
- *It maps an IP address to a logical-link address.* The slide says "logical-link address"; it means the link-layer (MAC) address.
- *A host or a router need to run the ARP program all of the time in the background. A host does not know when another host sends an ARP request; it needs to be ready all of the time to respond to an ARP request.*

## The request is broadcast, the reply is unicast

The ARP operation figure is one LAN with a switch and four systems: **System A** ($N_1\ L_1$), **System B** ($N_2\ L_2$) and two others ($N_3\ L_3$, $N_4\ L_4$). A knows $N_2$ and wants $L_2$.

| Step | Figure caption | Who receives it | Slide text of the message |
|---|---|---|---|
| a | *ARP request is broadcast* | every system on the LAN | *Request: Looking for link-layer address of a node with IP address N₂* |
| b | *ARP reply is unicast* | only System A | *Reply: I am the node and my link-layer address is L₂* |

The request goes to everyone because A does not know which machine owns $N_2$. The systems with $N_3$ and $N_4$ see it is not their IP address and drop it. B recognises its own address and replies, and since the request carried A's addresses, B can answer A directly.

### A resolves N₂ on the LAN

```widget
arp-exchange
{ "target": 2, "quiz": false }
```

## The ARP packet, field by field

The ARP packet format slide draws 32-bit rows. *Hardware: LAN or WAN protocol. Protocol: Network-layer protocol.*

| Field | Bits | Meaning |
|---|---|---|
| Hardware type | 16 | which LAN or WAN protocol (Ethernet) |
| Protocol type | 16 | which network-layer protocol (IPv4) |
| Hardware length | 8 | length of a hardware address in bytes |
| Protocol length | 8 | length of a protocol address in bytes |
| Operation | 16 | *Request: 1, Reply: 2* |
| Source hardware address | 48 for Ethernet | sender's MAC |
| Source protocol address | 32 for IPv4 | sender's IP |
| Destination hardware address | 48 | target's MAC, *empty in request* (shaded on the slide) |
| Destination protocol address | 32 | target's IP |

## The slide's example: the request and the reply in hex

System A ($N_1$, $L_1$) resolves System B ($N_2$, *L₂ not known by A*). The slide's two packets side by side:

| Field | ARP request (A to B) | ARP reply (B to A) | Slide annotation |
|---|---|---|---|
| Hardware type | `0x0001` | `0x0001` | Ethernet |
| Protocol type | `0x0800` | `0x0800` | IPv4 |
| Hardware length | `0x06` | `0x06` | 6 bytes (48-bit MAC addr) |
| Protocol length | `0x04` | `0x04` | 4 bytes (32-bit IP addr) |
| Operation | `0x0001` | `0x0002` | ARP request / ARP reply |
| Source hardware address | L1 | L2 | |
| Source protocol address | N1 | N2 | |
| Destination hardware address | **All 0s** | L1 | unknown in the request |
| Destination protocol address | N2 | N1 | |

In the reply the roles swap: B is now the source, so L2 and N2 move to the top and A's L1 and N1 to the bottom. A's unknown is answered by the reply's source hardware field, L2; the destination hardware field now holds L1.

:::quiz 0x0001 means two different things
In the hardware type field `0x0001` is Ethernet. In the operation field `0x0001` is a request and `0x0002` a reply. `0x0800` is IPv4 in the protocol type field. Read the field name before the value.
:::

## The frames that carry the two packets

Each ARP packet is the data of a frame. The slide labels the frames with letters:

| Step | Frame | Destination | Source | Slide label |
|---|---|---|---|---|
| 1, from A to B | [BA \| A \| Data] | **BA**, *broadcast address* | A | "Multicast frame" |
| 2, from B to A | [A \| B \| Data] | A | B | *Unicast frame* |

The request's frame destination is the broadcast address, so every station's data-link layer accepts it. The slide's figure labels that frame "Multicast frame", but slide 24 says *ARP request is broadcast* and the destination is BA, the broadcast address: the request is a **broadcast**. The reply's frame goes to A alone, unicast.

### The request and reply with six fields blanked

```widget
arp-exchange
{ "target": 2, "quiz": true }
```

## Fill in the ARP packets for host P and router R

On an Ethernet LAN running IPv4, host P (N5, L5) needs the link-layer address of router R (N9, L9); type values as the slide writes them, such as `0x0001` and `L5`.

```quiz
[
  {
    "q": "Fill in P's ARP request, field by field.",
    "type": "fill",
    "code": "Hardware type:                   ___\nProtocol type:                   ___\nHardware length:                 ___\nProtocol length:                 ___\nOperation:                       ___\nSource hardware address:         ___\nSource protocol address:         ___\nDestination protocol address:    ___",
    "answer": ["0x0001", "0x0800", "0x06", "0x04", "0x0001", "L5", "N5", "N9"],
    "explain": "Ethernet `0x0001`, IPv4 `0x0800`, a 6-byte MAC `0x06`, a 4-byte IP `0x04`, request `0x0001`. The source is P (L5, N5) and the target IP is R's, N9."
  },
  {
    "q": "What does the destination hardware address field hold in P's request?",
    "type": "text",
    "answer": ["all 0s", "all zeros", "all 0", "0s", "zeros", "0", "empty", "00:00:00:00:00:00"],
    "explain": "P does not know R's MAC yet, so the field is **empty in the request**: all 0s in the slide's example."
  },
  {
    "q": "Fill in R's ARP reply (the first four fields are the same as in the request).",
    "type": "fill",
    "code": "Operation:                       ___\nSource hardware address:         ___\nSource protocol address:         ___\nDestination hardware address:    ___\nDestination protocol address:    ___",
    "answer": ["0x0002", "L9", "N9", "L5", "N5"],
    "explain": "Reply `0x0002`. R is now the source, so L9 and N9 move up; P's L5 and N5 move to the destination fields. P's answer is the reply's source hardware address, L9."
  },
  {
    "q": "Which frame carries P's request?",
    "options": ["[BA | P | Data]", "[P | BA | Data]", "[R | P | Data]", "[P | R | Data]"],
    "answer": 0,
    "explain": "The request is broadcast: destination BA (the broadcast address) first, then the source P, as in the slide's [BA | A | Data]."
  },
  {
    "q": "Which frame carries R's reply?",
    "options": ["[P | R | Data]", "[R | P | Data]", "[BA | R | Data]", "[BA | P | Data]"],
    "answer": 0,
    "explain": "The reply is unicast to P: destination P, source R, as in the slide's [A | B | Data]."
  }
]
```

```quiz
[
  {
    "q": "What does ARP map?",
    "options": [
      "A port number to a process",
      "A MAC address to a host name",
      "An IP address to a link-layer (MAC) address",
      "A link to a route"
    ],
    "answer": 2,
    "explain": "Address Resolution Protocol maps an IP address to a link-layer address (the slide says logical-link address). A node knows the next node's IP address from its forwarding table and needs its MAC address to build the frame."
  },
  {
    "q": "According to the slide, ARP is one of the auxiliary protocols defined in the _______ layer.",
    "type": "text",
    "answer": ["network"],
    "explain": "The slide places ARP in the network layer as an auxiliary protocol, even though it is useful when moving a frame through a link, which is the data-link layer's job."
  },
  {
    "q": "An ARP request is _______ and an ARP reply is _______.",
    "options": [
      "unicast; broadcast",
      "broadcast; unicast",
      "broadcast; broadcast",
      "unicast; unicast"
    ],
    "answer": 1,
    "explain": "The request is broadcast because the sender does not know which machine owns the IP address, so every system on the LAN must see it. Only the owner replies, and it replies unicast, straight to the requester, whose addresses were in the request."
  },
  {
    "q": "A host only needs to run ARP when it is about to send a datagram.",
    "type": "tf",
    "answer": false,
    "explain": "A host or a router needs to run the ARP program all of the time in the background: it does not know when another host will send an ARP request and must be ready to respond at any time."
  },
  {
    "q": "In the ARP packet format, which field is empty in a request?",
    "options": [
      "Source hardware address",
      "Destination protocol address",
      "Destination hardware address",
      "Protocol type"
    ],
    "answer": 2,
    "explain": "The destination hardware address is what the sender is asking for, so the request carries all 0s there. The destination protocol address (the IP address being resolved) is filled in; that is how the owner recognises the request."
  },
  {
    "q": "What is the value of the operation field in an ARP reply?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "explain": "Operation: request = 1 (0x0001), reply = 2 (0x0002). The slide's example reply shows 0x0002 in that field."
  },
  {
    "q": "In the slide's ARP example, the protocol type field holds 0x0800. What does it mean?",
    "options": ["Ethernet", "IPv4", "a 6-byte address", "an ARP request"],
    "answer": 1,
    "explain": "0x0800 is IPv4 in the protocol type field. 0x0001 is Ethernet in the hardware type field and a request in the operation field; 0x06 is the hardware length (6 bytes, 48-bit MAC)."
  },
  {
    "q": "Match each ARP field value from the slide's example request to its meaning.",
    "type": "match",
    "pairs": [
      ["Hardware type 0x0001", "Ethernet"],
      ["Protocol type 0x0800", "IPv4"],
      ["Hardware length 0x06", "6 bytes, a 48-bit MAC address"],
      ["Protocol length 0x04", "4 bytes, a 32-bit IP address"]
    ],
    "explain": "Hardware describes the LAN or WAN protocol and its address length; protocol describes the network-layer protocol and its address length. 6 bytes = 48 bits, 4 bytes = 32 bits."
  },
  {
    "q": "System A (N1, L1) sends an ARP request for System B (N2, L2). Which addresses appear in the four address fields of the request, in slide order (source hardware, source protocol, destination hardware, destination protocol)?",
    "options": [
      "L1, N1, All 0s, N2",
      "L1, N1, L2, N2",
      "All 0s, N2, L1, N1",
      "L2, N2, L1, N1"
    ],
    "answer": 0,
    "explain": "The request carries the sender's own L1 and N1, all 0s for the unknown destination hardware address, and the target IP address N2. L2, N2, L1, N1 is the reply, where B is the source."
  },
  {
    "q": "The frame carrying an ARP request has the broadcast address as its destination and the requester's address as its source.",
    "type": "tf",
    "answer": true,
    "explain": "The slide's frame is [BA | A | Data] with BA the broadcast address and A the source, so every station on the LAN accepts it. The reply travels in a unicast frame [A | B | Data]."
  }
]
```
