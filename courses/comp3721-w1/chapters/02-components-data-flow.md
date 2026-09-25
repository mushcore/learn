---
title: Five components & data flow
minutes: 10
---

Every data communications system is built from the same **five components**, and every link carries data in one of three directions.

## The five components

| Component | Slide definition | Slide examples |
|---|---|---|
| **Message** | the information (data) to be communicated | text, numbers, pictures, audio, video |
| **Sender** | the device that sends the data message | computer, workstation, telephone handset, video camera |
| **Receiver** | the device that receives the message | computer, workstation, telephone handset, television |
| **Transmission medium** | the physical path by which a message travels from sender to receiver | twisted-pair wire, coaxial cable, fibre-optic cable, air |
| **Protocol** | a set of rules that govern data communications | |

Two details from the slide:

- Under **sender**, the slide repeats the Lecture 01a rule: *all digital communication messages should be represented and transmitted as bits.*
- A **telephone handset** appears in both the sender and the receiver lists. The same device can play either role.

## Protocol: the agreement

The protocol slide has two sentences:

> A protocol is **a set of rules that govern data communications.**

> A protocol **represents an agreement between the communicating devices.**

Both devices must agree on the rules, or a message can be delivered perfectly and still mean nothing.

## Data flow: modes of communication

| Mode | Slide description | Slide picture | Everyday example |
|---|---|---|---|
| **Simplex** | unidirectional communication | mainframe sends to a monitor; "direction of data" one way | television broadcast |
| **Half-duplex** | two-directional communication, **one at a time** | "direction of data at time 1", then "direction of data at time 2" | walkie-talkie |
| **Full-duplex** | two-directional communication, **simultaneously** | "direction of data all the time" | telephone |

:::quiz Sample quiz question (true or false)
**"In full-duplex mode of communication, signals going in one direction share the capacity of the link with signals going in the other direction."** **True.** Both directions use the one link at the same time, so its capacity is shared: either two physically separate paths inside the link, or the link's capacity divided between the two directions (Forouzan §1.1). Shared, not doubled.
:::

## Try it

```quiz
[
  {
    "q": "Which of these are the five components of a data communications system? Select all that apply.",
    "options": ["Message", "Sender", "Receiver", "Transmission medium", "Protocol", "Modem", "Router"],
    "answer": [0, 1, 2, 3, 4],
    "explain": "The five components are message, sender, receiver, transmission medium, and protocol. Modems and routers are *connecting devices*, which belong to the network lesson, not to this list."
  },
  {
    "q": "A ___ is a set of rules that govern data communications.",
    "type": "text",
    "answer": ["protocol"],
    "explain": "**Protocol**: a set of rules that govern data communications. It represents an agreement between the communicating devices."
  },
  {
    "q": "The ___ is the physical path by which a message travels from sender to receiver.",
    "type": "text",
    "answer": ["transmission medium", "medium", "transmission media"],
    "explain": "The **transmission medium** is the physical path; the slide's examples are twisted-pair wire, coaxial cable, fibre-optic cable, and air."
  },
  {
    "q": "Which component of a data communications system 'represents an agreement between the communicating devices'?",
    "options": ["Message", "Sender", "Transmission medium", "Protocol"],
    "answer": 3,
    "explain": "That phrase is written on the protocol slide. Both devices must agree on the same rules for the exchange to mean anything."
  },
  {
    "q": "A telephone handset can be a sender but not a receiver.",
    "type": "tf",
    "answer": false,
    "explain": "The slide lists the telephone handset under **both** sender (computer, workstation, telephone handset, video camera) and receiver (computer, workstation, telephone handset, television)."
  },
  {
    "q": "Which list matches the slide's examples of transmission media?",
    "options": [
      "Twisted-pair wire, coaxial cable, fibre-optic cable, and air",
      "Copper wire only; air cannot be a medium",
      "Fibre-optic cable and satellites only",
      "Routers, switches, and modems"
    ],
    "answer": 0,
    "explain": "The four media named on the slide are twisted-pair wire, coaxial cable, fibre-optic cable, and air. Air is a medium (it carries radio waves); routers and switches are devices, not media."
  },
  {
    "q": "Communication in one direction only, as from a mainframe to a monitor, is called ___ mode.",
    "type": "text",
    "answer": ["simplex"],
    "explain": "**Simplex** is unidirectional communication. The slide's picture is a mainframe sending to a monitor, with a television as the icon."
  },
  {
    "q": "In ___ mode, data can travel in both directions, but only one direction at a time.",
    "type": "text",
    "answer": ["half-duplex", "half duplex", "halfduplex"],
    "explain": "**Half-duplex**: two-directional communication, one at a time. The slide shows direction of data at time 1 and the opposite direction at time 2, with a walkie-talkie as the example."
  },
  {
    "q": "A walkie-talkie is the lecture's example of full-duplex communication.",
    "type": "tf",
    "answer": false,
    "explain": "A walkie-talkie is **half-duplex**: you press to talk and release to listen, so only one direction is active at a time. The full-duplex example is the telephone."
  },
  {
    "q": "In full-duplex mode of communication, signals going in one direction share the capacity of the link with signals going in the other direction.",
    "type": "tf",
    "answer": true,
    "explain": "This is the instructor's sample quiz question, and it is true. Both directions use the link at the same time, so its capacity is shared between them (two separate paths inside the link, or a divided capacity)."
  },
  {
    "q": "Which mode is described on the slide as 'two-directional communication, simultaneously'?",
    "options": ["Simplex", "Half-duplex", "Full-duplex", "Multipoint"],
    "answer": 2,
    "explain": "**Full-duplex** is two-directional and simultaneous ('direction of data all the time'); half-duplex is two-directional but one at a time; simplex is one direction only."
  },
  {
    "q": "The message is the information (data) to be communicated, and popular forms include text, numbers, pictures, audio, and video.",
    "type": "tf",
    "answer": true,
    "explain": "Slide wording for the message component. Those five forms match the examples of *data* in the previous lesson."
  }
]
```
