---
title: Protocols & why we layer
minutes: 12
---

Lecture 01a ended with the Internet as a "network of networks." Lecture 01b asks the obvious follow-up: with that many moving parts, how does anyone organize it? The answer is **protocol layering**, and Quiz 2 will test the vocabulary of this lesson almost word for word.

## Networks are complex

The slides list the "pieces" a network is made of:

- hosts
- routers
- links of various media
- applications
- protocols
- hardware, software

Then the question: *is there any hope of organizing the structure of a network?* Yes, and the trick is the same one used to run an airline.

## Analogy: organization of air travel

Airline travel is a series of steps involving many services. Read the left column top-down (departure) and the right column bottom-up (arrival):

| Departure | Service | Arrival |
|---|---|---|
| ticket (purchase) | **Ticketing service** | ticket (complain) |
| baggage (check) | **Baggage service** | baggage (claim) |
| gates (load) | **Gate service** | gates (unload) |
| runway takeoff | **Runway service** | runway landing |
| airplane routing | **Routing service** | airplane routing |

Each row is a **layer**, and each layer implements one service:

- via its own **internal-layer actions**
- relying on **services provided by the layer below**

The ticketing layer does not know how planes are routed. It just trusts that baggage, gates, runways, and routing will happen underneath it. That independence is the whole point.

## What is a protocol?

Lecture 01a defined a protocol as *a set of rules that govern data communications*. Lecture 01b gives the fuller version:

> A protocol defines **what** is communicated, **how** and **when**. This provides accurate and timely transfer of information between different devices on a network.

In other words, a protocol defines:

- the **format** and the **order** of messages exchanged between two or more communicating entities, and
- the **actions taken** on the transmission and/or receipt of a message or other event.

:::quiz Fill-in-the-blank wording
"A protocol defines **what** is communicated, **how** and **when**." Those three words are the ones most likely to be blanked out. The 01a version, "a set of rules that govern data communications," is equally fair game.
:::

## The two principles of protocol layering

The slides state exactly two principles. Learn them by number.

1. **First principle:** for having **bidirectional** communication, each layer must be able to perform **two opposite tasks**. (If a layer adds a header on the way out, the same layer must remove it on the way in. If it encrypts, it must also decrypt.)
2. **Second principle:** the **two objects under each layer at both sites should be identical**. (The thing the transport layer hands down at the sender must be the same thing the transport layer receives at the receiver. What travels between matching layers is identical, even though the layers below did work on it in between.)

:::warn Do not swap them
"Two opposite tasks" is the *first* principle. "Identical objects at both sites" is the *second*. A true/false question can hinge on which number goes with which.
:::

## What layering buys you

**Protocol layering enables us to divide the complex task of communication into multiple smaller and simpler tasks.** Network designers organize protocols, and the hardware and software that implement them, in layers.

Two definitions from the slide:

- The **service model** of a layer is *the services that a layer offers to the layer above*.
- Each layer provides its service by **performing certain actions within that layer** and by **using the services of the layer directly below it**.

Notice the direction: a layer serves the layer *above* and consumes from the layer *below*. It never reaches two layers down.

## The three advantages

The slide numbers them, so the quiz might too:

1. **Separating the services from the implementation.** The layer above only cares what service it gets, not how.
2. **Simpler and less expensive intermediate systems.** A device in the middle of the path only needs the lower layers (a switch needs two, a router needs three; see the next lessons). It does not carry the whole stack.
3. **Modularity (independent layers), a "black box."** This gives ease of maintenance and updating of the system: a change in a layer's service implementation is **transparent to the rest of the system**.

:::quiz Written-response candidate
"List two advantages of protocol layering" is exactly the shape of the sample quiz's written-response questions. Have all three ready in the slide's wording.
:::

## Protocol suite, and the two models

A **protocol suite (stack)** is *a set of protocols organized in different layers, designed to work together*.

The course uses two models for computer network operations:

| Model | Layers | Note |
|---|---|---|
| **TCP/IP protocol suite** | **5** | used in the Internet today (the Internet protocol stack) |
| **OSI model** | **7** | an ISO standard for network communications |

The next lesson walks through both, layer by layer.

## Try it

```quiz
[
  {
    "q": "According to the slides, a protocol defines **what** is communicated, **how**, and _______.",
    "type": "text",
    "answer": ["when"],
    "explain": "A protocol defines what is communicated, how and when. That triple is the core of the 01b definition."
  },
  {
    "q": "A protocol defines the format and the order of messages exchanged, as well as the actions taken on the transmission and/or receipt of a message.",
    "type": "tf",
    "answer": true,
    "explain": "This is the second half of the 01b definition: format, order, and the actions taken on sending or receiving a message or other event."
  },
  {
    "q": "The first principle of protocol layering says that, for bidirectional communication, each layer must be able to perform _______ tasks.",
    "type": "text",
    "answer": ["two opposite", "opposite", "2 opposite"],
    "explain": "First principle: each layer must be able to perform two opposite tasks (e.g. add a header / remove a header) so that communication can go both ways."
  },
  {
    "q": "The second principle of protocol layering states that the two objects under each layer at both sites should be identical.",
    "type": "tf",
    "answer": true,
    "explain": "Second principle: the objects (the units of data) under a given layer must be identical at the sender and the receiver."
  },
  {
    "q": "In the air-travel analogy, each layer implements its service via its own internal actions and by relying on the services of...",
    "options": ["the layer above", "the layer below", "every other layer", "the application layer only"],
    "answer": 1,
    "explain": "Each layer relies on services provided by the layer directly below it and offers its own service to the layer above. That is the service model."
  },
  {
    "q": "The service model of a layer is defined as the services that a layer offers to the layer _______.",
    "type": "text",
    "answer": ["above", "directly above"],
    "explain": "The service model is what a layer offers upward. It provides that service by using the layer directly below it."
  },
  {
    "q": "Select all of the advantages of protocol layering listed on the slides.",
    "options": [
      "Separating the services from the implementation",
      "Simpler and less expensive intermediate systems",
      "Modularity: independent layers that act as a black box",
      "Faster transmission speed on every link"
    ],
    "answer": [0, 1, 2],
    "explain": "The three listed advantages are separation of service from implementation, simpler/cheaper intermediate systems, and modularity. Speed is not one of them."
  },
  {
    "q": "Because of modularity, a change in one layer's service implementation is transparent to the rest of the system.",
    "type": "tf",
    "answer": true,
    "explain": "That is the stated consequence of modularity (independent layers, black box): ease of maintenance and updating, because a change inside one layer is invisible to the others."
  },
  {
    "q": "A set of protocols organized in different layers and designed to work together is called a protocol _______ (or stack).",
    "type": "text",
    "answer": ["suite", "protocol suite"],
    "explain": "A protocol suite (stack) is a set of protocols organized in different layers, designed to work together. TCP/IP is one; OSI is the other model the course uses."
  },
  {
    "q": "How many layers does the TCP/IP protocol suite have, and how many does the OSI model have?",
    "options": ["TCP/IP 4, OSI 7", "TCP/IP 5, OSI 7", "TCP/IP 7, OSI 5", "TCP/IP 5, OSI 5"],
    "answer": 1,
    "explain": "The TCP/IP protocol suite is a five-layer hierarchical model used in the Internet today; the OSI model is a seven-layer ISO standard."
  },
  {
    "q": "Protocol layering means a layer may directly use the services of any layer beneath it, not just the one immediately below.",
    "type": "tf",
    "answer": false,
    "explain": "Each layer provides its service by performing actions within that layer and by using the services of the layer directly below it. One layer down, not two."
  }
]
```
