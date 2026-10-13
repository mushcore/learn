---
title: TCP/IP's five layers & the OSI model
minutes: 15
---

Every layer has a **job**, a **PDU name** and a list of **example protocols**; the table gives all three, and the notes under it add only what the table cannot hold.

## The TCP/IP protocol suite

**TCP/IP** (Transmission Control Protocol / Internet Protocol) is the protocol suite *used in the Internet today* (the Internet protocol stack). It is a **five-layer hierarchical model**, numbered from the bottom:

| # | Layer | Job (slide wording) | PDU name | Example protocols | Implemented in |
|---|---|---|---|---|---|
| 5 | **Application** | communication for a network application between end systems | **message** | IMAP, SMTP, HTTP, FTP, Telnet, DNS | software in the end systems |
| 4 | **Transport** | logical communication between application processes running on different hosts (**process-to-process** delivery of the entire message) | **segment** / **user datagram** | TCP, UDP, SCTP | almost always software in the end systems |
| 3 | **Network** | routing of datagrams from source to destination (**host-to-host** communication) | **datagram** / **packet** | IP, ICMP, DHCP, ARP, routing protocols | hosts and routers |
| 2 | **Data link** | data transfer between **neighbouring** network elements/devices (without errors) | **frame** | Ethernet, 802.11 (WiFi) | NIC |
| 1 | **Physical** | carries individual **bits** across the link (from one node to the next) | bits | link dependent | NIC |

The "implemented in" column combines two slides: transport and application are software in the end systems, and the "Good to know" slide puts the physical and data-link layers in a **NIC (Network Interface Card)**, which handles communication over a **specific link**. **Hosts (end systems) implement all 5 layers**; a switch implements two and a router three (next lessons). The network layer is also called the **IP layer**.

## PDU

A **PDU (Protocol Data Unit)** is *a unit of data that is passed between different layers of a protocol stack*. Each layer has its own name for its PDU. The slide's example PDU is an Ethernet **frame**, the data-link PDU; its fields are in the next lesson.

## What the table leaves out

- **Physical.** *Actually, the bits received in a frame from the data-link layer are transformed to signals and sent through the transmission medium.* Physical layer protocols are **link dependent**: they rely on the actual transmission medium of the link. Turning bits into signals is the physical layer's job, not the data link's.
- **Data link.** "Neighbouring" is the key word: the data-link layer moves a frame across **one link**, from a node to the next node, and does not know the final destination.
- **Network and transport.** Host-to-host (network) reaches the right computer; process-to-process (transport) reaches the right program on it. Transport's PDU is a segment for TCP and a user datagram for UDP.

## The OSI model

The **OSI (Open Systems Interconnection) model** is an **ISO standard** for network communications, a layered framework with **7 layers**:

| OSI layer | TCP/IP equivalent |
|---|---|
| L7 Application | Application |
| L6 Presentation | Application |
| L5 Session | Application |
| L4 Transport | Transport |
| L3 Network | Network |
| L2 Data Link | Data Link |
| L1 Physical | Physical |

The **Application, Presentation, and Session** layers of OSI are **combined into the Application layer** in the TCP/IP suite. The two extra layers:

- **Presentation layer:** allows communicating applications to interpret the meaning of data exchanged. Examples: data compression, data encryption.
- **Session layer:** session management, synchronization of data exchange.

:::warn Numbering trap
"Transport" is layer 4 in **both** models; "Application" is layer 5 in TCP/IP but layer 7 in OSI. TCP/IP layer 5 is Application; OSI layer 5 is Session.
:::

```quiz
[
  {
    "q": "_______ layer of the TCP/IP protocol suite provides host-to-host communication.",
    "type": "text",
    "answer": ["network", "network layer", "the network layer"],
    "explain": "The network layer routes datagrams from source host to destination host. That is host-to-host communication. The transport layer is process-to-process."
  },
  {
    "q": "The data-link layer transforms bits to electromagnetic signals.",
    "type": "tf",
    "answer": false,
    "explain": "That is the physical layer. The data-link layer delivers a frame to the next node; the physical layer turns the frame's bits into signals on the medium."
  },
  {
    "q": "Match each TCP/IP layer to the name of its PDU.",
    "type": "match",
    "pairs": [
      ["Application", "message"],
      ["Transport", "segment / user datagram"],
      ["Network", "datagram / packet"],
      ["Data link", "frame"],
      ["Physical", "bits"]
    ],
    "explain": "Top to bottom: message, segment (or user datagram), datagram (or packet), frame, bits. Each layer wraps the PDU it receives from above."
  },
  {
    "q": "Match each protocol to the TCP/IP layer it belongs to.",
    "type": "match",
    "pairs": [
      ["HTTP, SMTP, DNS", "Application"],
      ["TCP, UDP, SCTP", "Transport"],
      ["IP, ICMP, DHCP, ARP", "Network"],
      ["Ethernet, 802.11 (WiFi)", "Data link"]
    ],
    "explain": "Application: IMAP, SMTP, HTTP, FTP, Telnet, DNS. Transport: TCP, UDP, SCTP. Network: IP, ICMP, DHCP, ARP, routing protocols. Data link: Ethernet, 802.11."
  },
  {
    "q": "The transport layer provides logical communication between application processes running on different hosts, i.e. _______-to-_______ delivery.",
    "options": ["host-to-host", "node-to-node", "process-to-process", "link-to-link"],
    "answer": 2,
    "explain": "Transport = process-to-process delivery of the entire message. Network = host-to-host. Data link = node-to-node (neighbouring devices)."
  },
  {
    "q": "The physical layer and data-link layer are typically implemented in a _______ (three-letter abbreviation).",
    "type": "text",
    "answer": ["NIC", "network interface card"],
    "explain": "A NIC (Network Interface Card) implements the physical and data-link layers and handles communication over a specific link."
  },
  {
    "q": "Hosts (end systems) implement all five layers of the TCP/IP protocol stack.",
    "type": "tf",
    "answer": true,
    "explain": "End systems run the full stack. Intermediate devices run fewer layers: a switch runs data link and physical, a router runs network, data link, and physical."
  },
  {
    "q": "Which OSI layers are combined into the application layer of the TCP/IP suite? Select all that apply.",
    "options": ["Session", "Transport", "Application", "Presentation"],
    "answer": [0, 2, 3],
    "explain": "OSI's Application, Presentation, and Session layers all live inside TCP/IP's single application layer. Transport stays a separate layer in both models."
  },
  {
    "q": "Data compression and data encryption are examples of services of the OSI _______ layer.",
    "type": "text",
    "answer": ["presentation", "presentation layer"],
    "explain": "The presentation layer lets communicating applications interpret the meaning of the data exchanged; compression and encryption are its examples. The session layer handles session management and synchronization."
  },
  {
    "q": "Physical layer protocols are link dependent: they rely on the actual transmission medium of the link.",
    "type": "tf",
    "answer": true,
    "explain": "The physical layer converts bits to signals for a specific medium, so its protocols depend on that medium. This is why changing a LAN technology changes the physical (and data-link) layer."
  }
]
```
