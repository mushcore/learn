---
title: Mock Quiz 1 (Lecture 01a)
minutes: 25
---

Quiz 1 covers **Lecture Notes 01a only**: data communications, the five components, data flow, networks and their criteria, connection types, the four topologies, LAN and WAN, internets and the Internet, and Internet standards. The real quiz is written in the lab with one hand-written A4 study note and a calculator, in three formats: true or false, fill in the blanks, and short written response. This mock uses the same wording as the slides, in slide order. Do it in one sitting without notes.

```quiz
[
  {
    "q": "Fill in the blank: ________ is the exchange of information.",
    "type": "text",
    "answer": ["communication"],
    "explain": "Communication is the exchange of information. Adding 'at a distance' turns it into telecommunication."
  },
  {
    "q": "Fill in the blank: communication at a distance (telephony, telegraphy and television) is called ________.",
    "type": "text",
    "answer": ["telecommunication", "telecommunications"],
    "explain": "Telecommunication is communication at a distance; the slide's three examples all start with tele-: telephony, telegraphy, television."
  },
  {
    "q": "A data communications system is a network of hardware and software that enables the exchange of data between devices over various transmission mediums.",
    "type": "tf",
    "answer": true,
    "explain": "True, that is the slide definition word for word. Do not confuse it with data communications itself, which is the exchange of data between two devices via some form of transmission medium."
  },
  {
    "q": "All digital communication messages should be represented and transmitted as bits.",
    "type": "tf",
    "answer": true,
    "explain": "True. Digital communication is the electronic transmission of information using digital signals, and every message is represented as bits. Analog communication instead uses continuous signals that vary in amplitude, frequency or phase."
  },
  {
    "q": "Select all four fundamental characteristics that the effectiveness of a data communications system depends on.",
    "options": ["Delivery", "Accuracy", "Security", "Timeliness", "Jitter", "Cost"],
    "answer": [0, 1, 3, 4],
    "explain": "Delivery (to the correct destination), accuracy, timeliness, and jitter. Security is a network criterion, not one of the four effectiveness characteristics; cost is not on the slide at all."
  },
  {
    "q": "Fill in the blank: ________ is the uneven delay in the delivery of audio or video packets.",
    "type": "text",
    "answer": ["jitter"],
    "explain": "Jitter is uneven delay. Timeliness is a different characteristic: delivering data in a timely manner at all."
  },
  {
    "q": "Which of these is NOT one of the five components of a data communications system?",
    "options": ["Sender", "Transmission medium", "Router", "Protocol"],
    "answer": 2,
    "explain": "The five components are message, sender, receiver, transmission medium and protocol. A router is a connecting device inside a network, not a component of the communication system model."
  },
  {
    "q": "Fill in the blank: the ________ is the physical path by which a message travels from sender to receiver.",
    "type": "text",
    "answer": ["transmission medium", "medium"],
    "explain": "The transmission medium is the physical path: twisted-pair wire, coaxial cable, fibre-optic cable, or air."
  },
  {
    "q": "In the lecture's definition, a protocol is...",
    "options": ["a set of rules that govern data communications", "the physical path a message travels along", "a device that connects a network to other networks", "the information (data) to be communicated"],
    "answer": 0,
    "explain": "A protocol is a set of rules that govern data communications; it represents an agreement between the communicating devices. The other options are the transmission medium, a router, and the message."
  },
  {
    "q": "A mainframe sending data to a monitor, which can only receive, is the lecture's example of which data-flow mode?",
    "options": ["Simplex", "Half-duplex", "Full-duplex", "Multipoint"],
    "answer": 0,
    "explain": "Simplex is unidirectional communication: one device transmits, the other only receives (mainframe to monitor; a television)."
  },
  {
    "q": "Fill in the blank: in ________ mode, both devices can transmit and receive, but not at the same time (the walkie-talkie example).",
    "type": "text",
    "answer": ["half-duplex", "half duplex", "halfduplex"],
    "explain": "Half-duplex is two-directional communication, one direction at a time. Full-duplex is two-directional simultaneously (the telephone example)."
  },
  {
    "q": "In full-duplex mode of communication, signals going in one direction share the capacity of the link with signals going in the other direction.",
    "type": "tf",
    "answer": true,
    "explain": "True. This is the instructor's own sample question. In full-duplex both directions use the link at the same time, so the link's capacity is shared between them."
  },
  {
    "q": "Select every device the lecture lists as a host (end system) rather than a connecting device.",
    "options": ["Laptop", "Router", "Cellular phone", "Switch", "Desktop", "Modem"],
    "answer": [0, 2, 4],
    "explain": "Hosts (end systems): large computer, desktop, laptop, workstation, cellular phone. Connecting (networking) devices: router, switch, modem."
  },
  {
    "q": "Network performance is mainly measured in terms of...",
    "options": ["throughput and delay", "accuracy of delivery and failure rate", "cost and amount of cabling", "privacy and security"],
    "answer": 0,
    "explain": "Performance is measured mainly by throughput and delay. Accuracy of delivery and failure rate measure reliability; privacy is a mesh advantage, not a criterion."
  },
  {
    "q": "Fill in the blank: the network criterion measured by accuracy of delivery, failure rate, recovery time from failure and the network's robustness is ________.",
    "type": "text",
    "answer": ["reliability"],
    "explain": "Reliability. The three criteria are performance (throughput, delay), reliability (accuracy, failure rate, recovery time, robustness) and security (protecting data, recovery policies)."
  },
  {
    "q": "Fill in the blank: assume we have a dedicated link between two devices. This type of connection is called ________.",
    "type": "text",
    "answer": ["point-to-point", "point to point", "point-to-point connection", "point to point connection"],
    "explain": "Point-to-point: a dedicated link whose capacity is reserved for the two devices (wire, microwave or satellite links). Multipoint is the other type: more than two devices share one link."
  },
  {
    "q": "In a spatially shared multipoint connection, users must take turns using the link.",
    "type": "tf",
    "answer": false,
    "explain": "False. Spatially shared means several devices can use the link simultaneously. Timeshared is the one where users must take turns."
  },
  {
    "q": "A mesh topology connects 8 devices. How many cable links are needed?",
    "type": "numeric",
    "answer": 28,
    "tolerance": 0.5,
    "unit": "links",
    "explain": "$\\frac{n(n-1)}{2} = \\frac{8 \\times 7}{2} = 28$. Every device needs a dedicated point-to-point link to every other device."
  },
  {
    "q": "A star topology connects 20 devices to a hub. How many cable links are needed?",
    "type": "numeric",
    "answer": 20,
    "tolerance": 0.5,
    "unit": "links",
    "explain": "One dedicated link per device to the central hub: $n = 20$ links. Compare mesh with 20 devices: $20 \\times 19 / 2 = 190$."
  },
  {
    "q": "Select all the advantages of a mesh topology listed in the lecture.",
    "options": ["Each connection can carry its own data load (dedicated links)", "Robustness", "Less cabling than a star", "Privacy and security", "Ease of fault identification and fault isolation", "Ease of installation"],
    "answer": [0, 1, 3, 4],
    "explain": "Mesh advantages: dedicated links guarantee each connection carries its own load; robustness; privacy and security; ease of fault identification and isolation. Its disadvantages are the opposite of the two distractors: difficult installation and reconnection, and wiring that can exceed the available space."
  },
  {
    "q": "Select the two disadvantages of a star topology given in the lecture.",
    "options": ["The dependency of the whole topology on one single point", "Expensive hardware", "More cabling is required compared with bus and ring", "Difficult fault isolation"],
    "answer": [0, 2],
    "explain": "Exactly two on the slide: dependency on one single point (the hub) and more cabling than bus and ring. Expensive hardware belongs to mesh; difficult fault isolation belongs to bus."
  },
  {
    "q": "In a ring topology, a break in the ring can disable the whole network because traffic is unidirectional.",
    "type": "tf",
    "answer": true,
    "explain": "True. Each device connects only to its two neighbours with a repeater each, traffic flows one way, so one break stops everything. Its advantages are ease of installation and reconfiguration and ease of fault isolation."
  },
  {
    "type": "match",
    "q": "Match each topology to the number of cable links it needs for n devices.",
    "pairs": [
      ["Mesh", "n(n-1)/2"],
      ["Star", "n (one per device, to the hub)"],
      ["Bus", "1 backbone + n drop lines"],
      ["Ring", "n (one to each neighbour, around the loop)"]
    ],
    "explain": "Mesh is the number of pairs; star is one link per device to the hub; bus is one backbone cable plus a drop line per device; a ring of n devices closes with n links."
  },
  {
    "q": "A LAN is usually privately owned and connects some hosts in a single office, building, or campus.",
    "type": "tf",
    "answer": true,
    "explain": "True. A LAN is limited in size, each host has a unique identifier, and it is called a WLAN if the connection is wireless."
  },
  {
    "q": "A WAN is usually created and run by the organization that uses it.",
    "type": "tf",
    "answer": false,
    "explain": "False. A WAN is created and run by communication companies and leased by the organization that uses it. It spans a town, state, country or the world and interconnects switches, routers and modems. A point-to-point WAN connects two devices; a switched WAN connects more than two and is used in the backbone of global communication today."
  },
  {
    "q": "An internet (lower-case i) and the Internet (upper-case I) are two names for the same thing.",
    "type": "tf",
    "answer": false,
    "explain": "False. An internet is any two or more networks that can communicate with each other. The Internet is the most notable internet, composed of thousands of interconnected networks. Two or more connected networks make an internetwork."
  },
  {
    "q": "The first message ever sent over the ARPANET was 'LO', sent from UCLA on October 29, 1969.",
    "type": "tf",
    "answer": true,
    "explain": "True: 10:30 pm, Charley Kline at UCLA, with Leonard Kleinrock; the system crashed after the letters L and O. ARPANET was founded by the DoD."
  },
  {
    "q": "Fill in the blank: the main design goal of ARPANET was ________.",
    "type": "text",
    "answer": ["survivability"],
    "explain": "Survivability. Later milestones on the slide: 1990 Sir Tim Berners-Lee invented the World Wide Web; 1993 the first popular browser, Mosaic (then Netscape, Mozilla, Firefox)."
  },
  {
    "q": "Fill in the blank: the ________ network is the network that physically connects an end system to the first router (edge router) on a path to any other distant end system.",
    "type": "text",
    "answer": ["access", "access network"],
    "explain": "Access network. End systems (hosts) sit at the edge and run application programs; the core network is the routers, link-layer switches and links that interconnect the end systems. Customer networks connect to provider networks (ISPs), which meet at peering points and connect to backbones."
  },
  {
    "q": "With DSL (Digital Subscriber Line) service, the telephone line can be used simultaneously for both voice and data communication.",
    "type": "tf",
    "answer": true,
    "explain": "True. The access methods on the slide are telephone networks (dial-up and DSL), cable networks, wireless networks, and direct connection to the Internet."
  },
  {
    "q": "Fill in the blank: Internet standards and RFCs are created and published by the ________.",
    "type": "text",
    "answer": ["IETF", "Internet Engineering Task Force"],
    "explain": "The IETF (Internet Engineering Task Force). An Internet standard is a thoroughly tested specification and formalized regulation that must be followed. An RFC (Request for Comment) is a numbered, technical, detailed document defining standards, protocols, procedures and technologies; RFC-1 was written in 1969."
  },
  {
    "q": "Why do we need Internet standards, according to the lecture?",
    "options": ["Interoperability between systems and products", "To make the Internet faster", "To reduce the number of ISPs", "To replace RFCs"],
    "answer": 0,
    "explain": "Interoperability: products and systems from different makers can work together only if they follow the same thoroughly tested specifications."
  }
]
```
