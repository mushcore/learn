---
title: LAN, WAN, internets & the Internet
minutes: 13
---

Networks come in two sizes, LAN and WAN. Connecting networks together makes an internet, and eventually *the* Internet, which has a structure, access methods and a standards body of its own.

## Network types

### 1) LAN, Local Area Network

- usually **privately owned** and connects some hosts in a **single office, building, or campus**
- **limited in size**
- each host in a LAN has a **unique identifier**
- called **WLAN** if wirelessly connected

### 2) WAN, Wide Area Network

- a **wider geographical span**, spanning a town, a state, a country, or even the world
- interconnects network devices such as **switches, routers, and modems**
- **created and run by communication companies** and **leased** by an organization that uses it
- two types of WAN:
  1. **point-to-point WAN**: connecting **two** communication devices
  2. **switched WAN**: connecting **more than two** communication devices

> A **switched WAN** is used in the **backbone of global communication** today.

A LAN connects hosts and is usually privately owned; a WAN connects network devices and is leased from a communication company.

## Internetwork, internet, Internet

When **two or more networks are connected**, they make an **internetwork**. The slide's example: different branches of the same organization.

The capital letter matters:

- An **internet**, with lower-case i, is **two or more networks that can communicate with each other**.
- The most notable internet is called the **Internet**, with upper-case I, and is composed of **thousands of interconnected networks**.

Every Internet is an internet; an internet is not necessarily the Internet.

## A brief history of the Internet

| When | What (slide wording) |
|---|---|
| **October 29, 1969, 10:30 pm** | the first message sent over the Internet, from **UCLA**: "**LO**" (the system crashed after the first two letters of LOGIN); **Charley Kline** and **Leonard Kleinrock** |
| 1969 onward | **ARPANET** (The Advanced Research Projects Agency Network), **founded by the DoD**; its main design goal was **survivability**; **Vint Cerf** |
| **1990** | Sir **Tim Berners-Lee** invented the **World Wide Web (WWW)** |
| **1993** | the first popular and user-friendly web browser was developed: **Mosaic**, then Netscape, then Mozilla, then Firefox |

## Computer networks and the Internet

The Internet is a **network of networks**.

### Edge, access, core

- **End systems or hosts** sit at the **edge** of the Internet. Hosts run **application programs**, e.g. a web browser.
- The **access network** is the network that **physically connects an end system to the first router** (the **edge router**) on a path from the end system to any other distant end system.
- The **core network** is the network of **routers, link-layer switches, and links** that interconnects the Internet's end systems.

Your laptop is at the edge; your home Wi-Fi, modem and the line to your ISP are the access network; everything beyond that first router is the core.

### The structure: customers, providers, backbones

The lecture's diagram has three tiers joined at **peering points**:

| Tier | Slide label | Who |
|---|---|---|
| Top | **Backbones** | **international ISPs** |
| Middle | **Provider networks** | **national or regional ISPs** |
| Bottom | **Customer networks** | organizations and individuals who buy access from a provider |

**Internet Service Providers (ISPs)** run the provider networks and backbones. **Peering points** are where the backbones connect to each other and to the provider networks.

## Accessing the Internet

Four ways an end system reaches the Internet:

- **Telephone networks**
  - **dial-up** service
  - **DSL (Digital Subscriber Line)** service: the line can be used **simultaneously for both voice and data communication**, unlike dial-up
- **Cable networks**
- **Wireless networks**
- **Direct connection** to the Internet

## Internet standards and RFCs

An **Internet standard** is *a thoroughly tested specification and a formalized regulation that must be followed by those who work with the Internet.* It is **created and published by IETF (Internet Engineering Task Force)**.

*Why do we need Internet standards?* For **interoperability** between systems and products.

A **Request for Comment (RFC)** is:

- a **series of documents** used to define standards, protocols, procedures, and technologies for the Internet
- **assigned a number**
- **technical and detailed**

**IETF** is the organization responsible for the development and publication of RFCs. **RFC-1 was written in 1969**, the same year as the first ARPANET message.

```quiz
[
  {
    "q": "A LAN is usually privately owned and connects some hosts in a single office, building, or campus.",
    "type": "tf",
    "answer": true,
    "explain": "That is the slide definition of a LAN: privately owned, limited in size, within one office, building or campus; each host has a unique identifier."
  },
  {
    "q": "A LAN that is connected wirelessly is called a ___.",
    "type": "text",
    "answer": ["wlan", "wireless lan", "wireless local area network"],
    "explain": "A LAN is called a **WLAN** (wireless LAN) if it is wirelessly connected."
  },
  {
    "q": "A WAN is created and run by communication companies and leased by an organization that uses it.",
    "type": "tf",
    "answer": true,
    "explain": "Unlike a LAN (usually privately owned), a WAN is created and run by communication companies and **leased** by the organization that uses it."
  },
  {
    "q": "A WAN that connects more than two communication devices is called a ___ WAN.",
    "type": "text",
    "answer": ["switched"],
    "explain": "A **switched WAN** connects more than two communication devices; a **point-to-point WAN** connects exactly two. The switched WAN is used in the backbone of global communication today."
  },
  {
    "q": "Which of these does a WAN interconnect, according to the slide?",
    "options": ["Only hosts inside one building", "Network devices such as switches, routers, and modems", "Only wireless access points", "Only two computers"],
    "answer": 1,
    "explain": "A WAN interconnects network devices such as switches, routers, and modems, over a town, state, country or the world."
  },
  {
    "q": "An internet (lower-case i) and the Internet (upper-case I) are two names for the same thing.",
    "type": "tf",
    "answer": false,
    "explain": "An **internet** is any two or more networks that can communicate with each other. The **Internet** is the most notable internet, composed of thousands of interconnected networks. Every Internet is an internet, not the reverse."
  },
  {
    "q": "When two or more networks are connected, they make an ___.",
    "type": "text",
    "answer": ["internetwork", "internet", "internetwork (internet)"],
    "explain": "Two or more connected networks make an **internetwork**, or internet with lower-case i. The slide's example is different branches of the same organization."
  },
  {
    "q": "The main design goal of ARPANET was ___.",
    "type": "text",
    "answer": ["survivability"],
    "explain": "ARPANET, founded by the DoD, was designed for **survivability**: to keep working even when parts of the network failed."
  },
  {
    "q": "Match each event to its year or date.",
    "type": "match",
    "pairs": [
      ["First message over the Internet, 'LO', from UCLA", "October 29, 1969"],
      ["Tim Berners-Lee invented the World Wide Web", "1990"],
      ["Mosaic, the first popular user-friendly browser", "1993"],
      ["RFC-1 was written", "1969"]
    ],
    "explain": "1969: first message ('LO', Charley Kline and Leonard Kleinrock) and RFC-1. 1990: the WWW. 1993: Mosaic, which led to Netscape, Mozilla and Firefox."
  },
  {
    "q": "The network that physically connects an end system to the first (edge) router is called the ___ network.",
    "type": "text",
    "answer": ["access"],
    "explain": "The **access network** connects an end system to the first router on its path. The **core network** is the routers, link-layer switches and links beyond that."
  },
  {
    "q": "Which statement about the Internet's structure matches the lecture?",
    "options": [
      "Hosts sit in the core and routers sit at the edge",
      "End systems (hosts) sit at the edge and run application programs; the core is routers, link-layer switches and links",
      "The access network is the same thing as the backbone",
      "Customer networks connect directly to international backbones without providers"
    ],
    "answer": 1,
    "explain": "Hosts are at the edge and run applications such as a browser; the core network is the routers, link-layer switches and links that interconnect them. Customer networks reach the backbones through provider networks (national/regional ISPs) via peering points."
  },
  {
    "q": "With DSL service, the telephone line can be used simultaneously for both voice and data communication.",
    "type": "tf",
    "answer": true,
    "explain": "That is the slide's note on DSL (Digital Subscriber Line), under telephone-network access; dial-up did not allow this."
  },
  {
    "q": "Which of these are listed on the slide as ways of accessing the Internet? Select all that apply.",
    "options": ["Telephone networks (dial-up, DSL)", "Cable networks", "Wireless networks", "Direct connection to the Internet", "Peering points"],
    "answer": [0, 1, 2, 3],
    "explain": "The four access methods: telephone networks (dial-up and DSL), cable networks, wireless networks, and direct connection. Peering points are where backbones and providers interconnect, not an access method for end systems."
  },
  {
    "q": "Internet standards are created and published by the ___.",
    "type": "text",
    "answer": ["ietf", "internet engineering task force"],
    "explain": "The **IETF** (Internet Engineering Task Force) creates and publishes Internet standards and is responsible for the development and publication of RFCs."
  },
  {
    "q": "Why do we need Internet standards, according to the slide?",
    "options": ["To make the Internet faster", "For interoperability between systems and products", "To reduce the number of ISPs", "To assign IP addresses"],
    "answer": 1,
    "explain": "Standards exist for **interoperability**: products from different vendors can work together because they follow the same thoroughly tested specification."
  },
  {
    "q": "An RFC is a numbered, technical and detailed document; RFC-1 was written in 1969.",
    "type": "tf",
    "answer": true,
    "explain": "A Request for Comment is assigned a number, is technical and detailed, defines standards, protocols, procedures and technologies, and RFC-1 dates from 1969."
  }
]
```
