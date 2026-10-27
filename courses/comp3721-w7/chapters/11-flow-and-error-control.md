---
title: Flow control, error control and finite state machines
minutes: 15
---

A sender that is faster than its receiver floods it, and a frame hit by noise must not reach the network layer. Flow control and error control handle these two problems. The DLC protocols that provide them are described as finite state machines.

## Flow control balances production and consumption

Slide 22: *Whenever an entity produces items and another entity consumes them, there should be a balance between production and consumption rates. If the rate of produced frames is higher than the rate of consumed frames, frames at the receiving end need to be buffered while waiting to be consumed (processed).*

*A buffer is a set of memory locations that can hold packets at the sender and receiver.*

Slide 23 draws the sending node's data-link layer as the *Producer* and the receiving node's as the *Consumer*. *Frames are pushed* from producer to consumer, and a red arrow labelled *Flow control* runs back from the consumer to the producer.

## Two flow-control strategies: drop or feed back

Slide 23: *Different strategies to implement flow control:*

1. *The receiving data-link layer drops the frames if its buffer is full.*
2. *Receiving data-link layer sends a feedback to the sending data-link layer to ask it to stop or slow down.*

The first loses frames. The second needs a message going back, the arrow in the figure.

## Error control discards corrupted frames

Slide 24 opens: *A CRC is added to the frame header by the sender and checked by the receiver.* The frame figure (slide 11) puts the error-detection redundant bits in the trailer, and slide 33 draws the CRC at the end of the frame, so read the CRC as riding in the trailer. The CRC division itself is in [CRC division](#/comp3721-w7/crc-division).

Slide 24 gives two approaches:

| Approach | Slide wording | Where |
|---|---|---|
| 1 | *Corrupted frames are discarded, and the uncorrupted ones are delivered to the network layer.* | *Mostly used in wired LANs such as Ethernet.* |
| 2 | *Corrupted frames are discarded, and an acknowledgment is sent (for the purpose of both flow and error control) to the sender for the uncorrupted frames.* | the approach Stop-and-Wait uses |

Both discard corrupted frames. Only the second tells the sender anything.

## One acknowledgment serves both controls

Slide 25, *Combination of Flow and Error Control*: *The acknowledgment that is sent for flow control can also be used for error control to tell the sender the packet has arrived uncorrupted. The lack of acknowledgment means that there is a problem in the sent frame.*

An ACK therefore says two things: send the next frame (flow), and the last one arrived uncorrupted (error). No ACK means a problem with the frame.

## Simple and Stop-and-Wait are described by finite state machines

Slide 26: *Two most commonly used DLC protocols to deal with flow and error control: 1. Simple 2. Stop-and-Wait. The behavior of a data-link-layer protocol can be better shown as a finite state machine (FSM).*

Slide 27: *FSM is used to simulate sequential logic. An FSM is thought of as a machine (system) with a finite number of states. The machine is always in one of the states until an event occurs.*

| Drawn as | Shows |
|---|---|
| *Rounded-corner rectangles* or *circles* | *states* |
| *Colored text* | *events* |
| *Regular black text* | *actions* |

## The generic FSM of slide 28

Two states, State I and State II. *Note: The colored arrow shows the starting state.* The machine starts in State I.

| From | Event | Actions | To |
|---|---|---|---|
| State I | Event 1 | Action 1. Action 2. | State II |
| State II | Event 2 | Action 3. | State II (a loop) |
| State II | Event 3 | none | State I |

An event can fire several actions, one action, or none, and it can leave the machine in the same state.

## The turnstile FSM

Slide 29 models a coin turnstile with two states, Locked and Unlocked; a black dot with an arrow marks Locked as the start. The slide's table:

| Current State | Input | Next State | Output |
|---|---|---|---|
| Locked | coin | Unlocked | *Unlocks the turnstile so that the customer can push through.* |
| Locked | push | Locked | *None* |
| Unlocked | coin | Unlocked | *None* |
| Unlocked | push | Locked | *When the customer has pushed through, locks the turnstile.* |

In the diagram, push is a loop on Locked and coin is a loop on Unlocked: pushing a locked turnstile does nothing, and a second coin is accepted without changing anything. The other two inputs move the machine across, coin from Locked to Unlocked and push from Unlocked back to Locked.

Click coin and push in any order: the lit arrow shows the transition, and the output prints under the drawing. Pushing while Locked and paying twice both leave the state as it was.

```widget
fsm-explorer
{ "machine": "turnstile" }
```

```quiz
[
  {
    "q": "Which are the two flow-control strategies on slide 23?",
    "options": ["The receiver drops frames when its buffer is full, or sends feedback asking the sender to stop or slow down", "The receiver discards corrupted frames, or sends an acknowledgment for uncorrupted frames", "The sender adds a CRC, or the sender adds a sequence number", "The sender uses fixed-size frames, or variable-size frames"],
    "answer": 0,
    "explain": "1. *The receiving data-link layer drops the frames if its buffer is full.* 2. *Receiving data-link layer sends a feedback to the sending data-link layer to ask it to stop or slow down.* Discarding corrupted frames and acknowledging good ones are the two error-control approaches."
  },
  {
    "q": "Name it with the slide's word: a set of memory locations that can hold packets at the sender and receiver.",
    "type": "text",
    "answer": ["buffer", "a buffer", "buffers"],
    "explain": "*A buffer is a set of memory locations that can hold packets at the sender and receiver.* Frames are buffered at the receiving end when they are produced faster than they are consumed."
  },
  {
    "q": "Which error-control approach is mostly used in wired LANs such as Ethernet?",
    "options": ["Corrupted frames are discarded and the uncorrupted ones are delivered to the network layer", "Corrupted frames are discarded and an acknowledgment is sent for the uncorrupted frames", "Corrupted frames are corrected and delivered", "Every frame is acknowledged, corrupted or not"],
    "answer": 0,
    "explain": "Slide 24, approach 1: *Corrupted frames are discarded, and the uncorrupted ones are delivered to the network layer. Mostly used in wired LANs such as Ethernet.* Approach 2 adds an acknowledgment for the uncorrupted frames."
  },
  {
    "q": "The acknowledgment that is sent for flow control can also tell the sender the packet arrived uncorrupted.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 25: *The acknowledgment that is sent for flow control can also be used for error control to tell the sender the packet has arrived uncorrupted.*"
  },
  {
    "q": "The lack of acknowledgment means that the sent frame arrived.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 25: *The lack of acknowledgment means that there is a problem in the sent frame.*"
  },
  {
    "q": "Match each FSM drawing convention to what it shows.",
    "type": "match",
    "pairs": [
      ["Rounded-corner rectangle or circle", "A state"],
      ["Colored text", "An event"],
      ["Regular black text", "An action"],
      ["The colored arrow", "The starting state"]
    ],
    "explain": "Slide 27: *Rounded-corner rectangles or circles to show states. Colored text to show events. Regular black text to show actions.* Slide 28: *The colored arrow shows the starting state.*"
  },
  {
    "q": "The turnstile is Locked and the customer pushes. What is the next state?",
    "options": ["Locked", "Unlocked", "Blocking", "Ready"],
    "answer": 0,
    "explain": "Slide 29 table: Locked, push → Locked, output *None*. Pushing a locked turnstile changes nothing; it is a loop on Locked."
  },
  {
    "q": "The turnstile is Unlocked and the customer inserts a coin. What is the next state?",
    "options": ["Unlocked", "Locked", "Blocking", "Ready"],
    "answer": 0,
    "explain": "Unlocked, coin → Unlocked, output *None*: a loop on Unlocked. Only a push locks it again."
  },
  {
    "q": "The turnstile is Locked and the customer inserts a coin. What is the output?",
    "options": ["It unlocks the turnstile so that the customer can push through", "None", "It locks the turnstile when the customer has pushed through", "It returns the coin"],
    "answer": 0,
    "explain": "Locked, coin → Unlocked, output *Unlocks the turnstile so that the customer can push through.* Locking after the push is the output of Unlocked, push."
  },
  {
    "q": "Fill in the blank with the slide's word.",
    "type": "fill",
    "code": "The machine is always in one of the states until an ___ occurs.",
    "answer": ["event", "Event"],
    "explain": "Slide 27: *An FSM is thought of as a machine (system) with a finite number of states. The machine is always in one of the states until an event occurs.*"
  }
]
```
