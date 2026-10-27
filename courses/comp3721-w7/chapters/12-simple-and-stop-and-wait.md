---
title: The Simple protocol and Stop-and-Wait
minutes: 22
---

The Simple protocol sends frames and never looks back. Stop-and-Wait sends one frame, waits for its acknowledgment, and resends it when a timer runs out. Each protocol is a small FSM, and Stop-and-Wait still needs sequence numbers to catch duplicates.

## The Simple protocol has no flow or error control

Slide 30: *No flow and error control. Assumption is that the receiver can never be overwhelmed with incoming frames.*

Slide 31 gives each node one state, Ready, with one loop:

| Node | State | Event | Action |
|---|---|---|---|
| Sending | Ready | *Packet came from network layer.* | *Make a frame and send it.* |
| Receiving | Ready | *Frame arrived.* | *Deliver the packet to network layer.* |

The slide-32 flow diagram has four dashed time lines: the sending node's Network and Data-link, then the receiving node's Data-link and Network. A Packet goes down at the sender, a Frame slants across the link (lower on the right, because it takes time), and a Packet goes up at the receiver. Nothing comes back: no acknowledgments.

## Stop-and-Wait sends one frame and waits for its ACK

Slide 33: *A connection-based (connection-oriented) protocol. Both flow and error control provided. The sender sends one frame at a time and waits for an acknowledgment before sending the next one. A timer used by the sender (if the timer expires, the frame is retransmitted). If the CRC is correct, the receiver will send an acknowledgement.*

The figure joins the nodes with a *Logical link (duplex)*: the Frame travels right with its CRC at the end, the ACK travels left with its own CRC, and a *Timer* sits under the sending node.

## The Stop-and-Wait FSM

Slide 34. The sender has two states, Ready (the start) and Blocking:

| From | Event | Actions | To |
|---|---|---|---|
| Ready | *Packet came from network layer.* | *Make a frame, save a copy, and send the frame. Start the timer.* | Blocking |
| Blocking | *Time-out.* | *Resend the saved frame. Restart the timer.* | Blocking |
| Blocking | *Corrupted ACK arrived.* | *Discard the ACK.* | Blocking |
| Blocking | *Error-free ACK arrived.* | *Stop the timer. Discard the saved frame.* | Ready |

The receiver has one state, Ready, with two loops:

| Event | Actions |
|---|---|
| *Corrupted frame arrived.* | *Discard the frame.* |
| *Error-free frame arrived.* | *Extract and deliver the packet to network layer. Send ACK.* |

Blocking has no transition for a new packet from the network layer, so no new packet is accepted until the ACK arrives. That missing arrow is the flow control. The saved copy is what makes resending possible. A corrupted frame gets no ACK, so the sender's timer runs out and it resends.

Fire the sender's events from Ready: a new packet is disabled while Blocking, and only an error-free ACK takes the sender back to Ready. Fire the receiver's two events to see which one sends an ACK.

```widget
fsm-explorer
{ "machine": "sw" }
```

## Three exchanges on slide 35

Slide 35's legend: dark blue clock *Start the timer.*, white clock *Stop the timer.*, light blue clock *Restart a time-out timer.* Its notes: *A lost frame means either lost or corrupted. A lost ACK means either lost or corrupted.*

| Exchange | What happens |
|---|---|
| Normal | Packet, timer started, Frame, Packet delivered, ACK, timer stopped |
| Frame lost | Packet, timer started, Frame Lost, time-out: timer restarted, *Frame (resent)*, Packet delivered, ACK, timer stopped |
| ACK lost | Packet, timer started, Frame, Packet delivered, ACK Lost, time-out: timer restarted, *Frame (resent)*, Packet delivered again: *Duplicate*, ACK, timer stopped |

In the third exchange the receiver cannot tell the resent frame from a new one, so it delivers the same packet twice.

### Frames, ACKs and the timer

Watch the third exchange: the receiver has already delivered the packet when the ACK is lost, so the resent frame comes up as a duplicate.

```widget
stop-wait-play
{ "protocol": "stop-and-wait", "scenario": "all", "seq": false }
```

## Sequence numbers 0, 1 and ACK numbers 1, 0

Slide 36: *Duplicates and orders can be handled by adding a sequence number and acknowledgment number to the frames. Sequence numbers are 0, 1, 0, 1, 0, 1, . . . Acknowledgment numbers are 1, 0, 1, 0, 1, 0, … In other words, the sequence numbers start with 0, the acknowledgment numbers start with 1. An acknowledgment number always define the sequence number of the next frame to receive.*

The slides draw no numbered flow diagram. Applying slide 36 to the three exchanges gives this trace:

1. Frame 0 arrives; the receiver delivers it and replies ACK 1, the next frame it expects.
2. Frame 1 is lost; time-out; Frame 1 resent, delivered, ACK 0.
3. Frame 0 arrives and is delivered; ACK 1 is lost; time-out; Frame 0 resent.
4. The receiver expects 1 and sees 0: a duplicate. It discards the frame and sends ACK 1 again.
5. The sender gets ACK 1 and sends Frame 1.

The duplicate of slide 35 is now caught. *A similar concept in TCP in transport layer*: TCP comes later in the course.

### Sequence numbers catch the duplicate

The ACK-lost exchange again, with numbers on frames and ACKs: the resent Frame 0 is discarded and re-acknowledged with ACK 1 instead of being delivered.

```widget
stop-wait-play
{ "scenario": "ack-lost", "seq": true }
```

## Trace a Stop-and-Wait exchange

The sender sends Frame 0, Frame 1 and Frame 0, with sequence numbers. Frame 0 arrives error-free. The first copy of Frame 1 arrives corrupted.

```quiz
[
  {
    "q": "The first copy of Frame 1 arrives corrupted. What does the receiver do?",
    "options": ["Discards the frame and sends nothing", "Delivers the packet and sends ACK 0", "Sends ACK 1 to ask for the frame again", "Discards the frame and sends ACK 0"],
    "answer": 0,
    "explain": "Receiver FSM: *Corrupted frame arrived.* → *Discard the frame.* No ACK is sent for a corrupted frame; the receiver stays Ready."
  },
  {
    "q": "What does the sender do next?",
    "options": ["Waits in Blocking until the time-out, then resends the saved Frame 1 and restarts the timer", "Sends the next Frame 0 at once", "Makes a new copy of the packet and starts a second timer", "Discards the saved frame and returns to Ready"],
    "answer": 0,
    "explain": "No ACK comes back, so the timer expires: *Time-out.* → *Resend the saved frame. Restart the timer.* The sender stays Blocking. It discards the saved frame only on an error-free ACK."
  },
  {
    "q": "The resent Frame 1 arrives error-free. Which acknowledgment number does the receiver send?",
    "type": "numeric",
    "answer": 0,
    "tolerance": 0,
    "explain": "The acknowledgment number is the sequence number of the next frame to receive. After Frame 1 the next is Frame 0, so ACK 0."
  },
  {
    "q": "The next Frame 0 then arrives error-free. Which acknowledgment number does the receiver send?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "explain": "After Frame 0 the next frame expected is Frame 1, so ACK 1. The sequence numbers alternate 0, 1, 0 and the ACK numbers 1, 0, 1."
  }
]
```

```quiz
[
  {
    "q": "The Simple protocol provides flow control.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 30: *No flow and error control. Assumption is that the receiver can never be overwhelmed with incoming frames.*"
  },
  {
    "q": "A Stop-and-Wait sender in Blocking gets the event \"Time-out.\" What does it do?",
    "options": ["Resends the saved frame and restarts the timer", "Stops the timer and discards the saved frame", "Discards the ACK", "Makes a frame, saves a copy and sends it"],
    "answer": 0,
    "explain": "*Time-out.* → *Resend the saved frame. Restart the timer.* It stays in Blocking. Stopping the timer and discarding the saved frame is the action for an error-free ACK."
  },
  {
    "q": "A Stop-and-Wait sender in Blocking gets the event \"Corrupted ACK arrived.\" What happens?",
    "options": ["It discards the ACK and stays in Blocking", "It resends the saved frame at once", "It stops the timer and goes to Ready", "It sends an ACK back to the receiver"],
    "answer": 0,
    "explain": "*Corrupted ACK arrived.* → *Discard the ACK.* The machine stays Blocking; the timer keeps running and the time-out resends the frame."
  },
  {
    "q": "Name the state the Stop-and-Wait sender is in while it waits for an acknowledgment.",
    "type": "text",
    "answer": ["Blocking"],
    "explain": "Blocking. The sender goes Ready → Blocking when it sends a frame and starts the timer, and back to Ready on *Error-free ACK arrived.*"
  },
  {
    "q": "With sequence numbers, Frame 0 arrives error-free. Which acknowledgment number does the receiver send?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "explain": "*An acknowledgment number always define the sequence number of the next frame to receive.* After Frame 0 the next is Frame 1: ACK 1."
  },
  {
    "q": "Without sequence numbers, why does a lost ACK make the receiver deliver a duplicate?",
    "options": ["The sender times out and resends the frame, and the receiver cannot tell the resent frame from a new one", "The receiver discards the first copy and keeps the second", "The ACK carries the CRC of the frame", "The sender sends two frames at a time"],
    "answer": 0,
    "explain": "On slide 35 the receiver already delivered the packet; the ACK is lost, the timer expires, the frame is resent, and the receiver delivers it again: *Duplicate*. Slide 36's sequence numbers let it see the resent Frame 0 is not the Frame 1 it expects."
  },
  {
    "q": "Put the Stop-and-Wait sender's events and actions for one frame in order.",
    "type": "reorder",
    "lines": [
      "Packet came from network layer",
      "Make a frame, save a copy, and send the frame",
      "Start the timer",
      "Error-free ACK arrived",
      "Stop the timer",
      "Discard the saved frame"
    ],
    "explain": "Ready: *Packet came from network layer.* → *Make a frame, save a copy, and send the frame. Start the timer.* → Blocking. Then *Error-free ACK arrived.* → *Stop the timer. Discard the saved frame.* → Ready."
  },
  {
    "q": "The Stop-and-Wait receiver sends an ACK for a corrupted frame.",
    "type": "tf",
    "answer": false,
    "explain": "Receiver FSM: *Corrupted frame arrived.* → *Discard the frame.* Only *Error-free frame arrived.* → *Extract and deliver the packet to network layer. Send ACK.*"
  },
  {
    "q": "Fill in the blank with the slide's word.",
    "type": "fill",
    "code": "The sender sends one frame at a time and waits for an ___ before sending the next one.",
    "answer": ["acknowledgment", "acknowledgement", "ACK"],
    "explain": "Slide 33: *The sender sends one frame at a time and waits for an acknowledgment before sending the next one. A timer used by the sender (if the timer expires, the frame is retransmitted).*"
  }
]
```
