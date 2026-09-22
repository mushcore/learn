---
title: Five components & data flow
minutes: 12
---

Every data communications system, from two laptops on a cable to a video call across the world, is built from the same **five components**. After that, the lecture asks one more question about any link: which way does the data flow?

## The five components

| Component | Slide definition | Slide examples |
|---|---|---|
| **Message** | the information (data) to be communicated | text, numbers, pictures, audio, video |
| **Sender** | the device that sends the data message | computer, workstation, telephone handset, video camera |
| **Receiver** | the device that receives the message | computer, workstation, telephone handset, television |
| **Transmission medium** | the physical path by which a message travels from sender to receiver | twisted-pair wire, coaxial cable, fibre-optic cable, air |
| **Protocol** | a set of rules that govern data communications | |

Two small details from the slides are worth a second look:

- Under **sender**, the slide repeats the Lecture 01a rule: *all digital communication messages should be represented and transmitted as bits.* The sender is where data becomes bits.
- A **telephone handset** appears in both the sender and the receiver lists; a **video camera** only as a sender and a **television** only as a receiver. The same device can play either role.

## Protocol: the agreement

The protocol box on the slide carries two sentences. Memorize both:

> A protocol is **a set of rules that govern data communications.**

> A protocol **represents an agreement between the communicating devices.**

The second sentence is the "why": both devices must agree on the rules, otherwise a message can be delivered perfectly and still mean nothing. (Beyond the slides: the textbook adds that without a protocol two devices may be *connected* but not *communicating*.)

:::quiz Fill-in-the-blank wording
"A ___ is a set of rules that govern data communications" wants **protocol**. "The ___ is the physical path by which a message travels from sender to receiver" wants **transmission medium**. Be ready to list all five components from memory; it is a natural written-response question.
:::

## Data flow: modes of communication

Take any link between two devices. There are three possibilities for the direction of data.

| Mode | Slide description | Slide picture | Everyday example |
|---|---|---|---|
| **Simplex** | unidirectional communication | mainframe sends to a monitor; "direction of data" one way | television broadcast |
| **Half-duplex** | two-directional communication, **one at a time** | "direction of data at time 1", then "direction of data at time 2" | walkie-talkie |
| **Full-duplex** | two-directional communication, **simultaneously** | "direction of data all the time" | telephone |

The pictures on the slides carry the intuition:

- **Simplex**: a mainframe drives a monitor. The monitor never sends anything back. A keyboard is the same idea in the other direction.
- **Half-duplex**: two laptops, one arrow at time 1 and the opposite arrow at time 2. With a walkie-talkie you press to talk and release to listen; both people cannot talk at once.
- **Full-duplex**: two laptops, arrows both ways *all the time*. On the telephone both people can speak and hear at the same moment.

:::quiz Sample quiz question (true or false)
The instructor's own sample quiz asks: **"In full-duplex mode of communication, signals going in one direction share the capacity of the link with signals going in the other direction."**

The answer is **True**. The link has one total capacity and, in full-duplex, both directions use it at the same time, so they share it. The assigned textbook reading (Forouzan §1.1) explains that this sharing happens either by using two physically separate paths inside the link or by dividing the link's capacity between the two directions. Either way, the capacity is shared, not doubled.
:::

:::warn Do not confuse the modes
- Half-duplex is *not* "one direction only"; both directions are possible, just not at the same time.
- Simplex is *not* "slow duplex"; it is strictly one way, and the receiver cannot reply on that link at all.
- The dividing line between half- and full-duplex is the single word **simultaneously**.
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
